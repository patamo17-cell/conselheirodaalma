import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Heart, BookOpen, Music, Sparkles, Loader2, Volume2, Users, Settings, Crown, Check, X, User as UserIcon, LogOut, Phone, Mail, Lock, Trash2, Edit, Plus, ChevronLeft, Search } from "lucide-react";
import { getCounselFromDatabase } from "@/src/lib/counselorService";
import { auth, googleProvider, db } from "@/src/lib/firebase";
import { CATEGORIAS_KEYWORDS, SENTIMENTOS_TAGS } from "@/src/lib/constants";
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updatePassword as updateAuthPassword, 
  signOut 
} from "firebase/auth";
import { collection, getDocs, updateDoc, setDoc, doc, getDoc, writeBatch } from "firebase/firestore";
import { migrarVersiculosParaFirebase } from "@/src/lib/migration";
import bancoVersiculos from "../banco_versiculos.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activePlayer, setActivePlayer] = useState<{ type: 'youtube' | 'spotify'; query: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminSubView, setAdminSubView] = useState<'menu' | 'users' | 'content'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isProfileView, setIsProfileView] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Auth Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authError, setAuthError] = useState("");

  // Profile Form States
  const [profileFullName, setProfileFullName] = useState("");
  const [profilePhoneNumber, setProfilePhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allVerses, setAllVerses] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isVersesLoading, setIsVersesLoading] = useState(false);
  const [editingVerse, setEditingVerse] = useState<any>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [verseSearchTerm, setVerseSearchTerm] = useState("");
  const [isMaintenanceLoading, setIsMaintenanceLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        // Salvar/Atualizar usuário no Firestore
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        const userData: any = {
          uid: currentUser.uid,
          email: currentUser.email,
          lastLogin: new Date().toISOString()
        };

        if (currentUser.displayName) userData.displayName = currentUser.displayName;
        if (currentUser.photoURL) userData.photoURL = currentUser.photoURL;

        if (!userSnap.exists()) {
          const initialData = { ...userData, isPremium: false, fullName: fullName || currentUser.displayName || "", phoneNumber: phoneNumber || "" };
          await setDoc(userRef, initialData);
          setCurrentUserData(initialData);
          setProfileFullName(initialData.fullName);
          setProfilePhoneNumber(initialData.phoneNumber);
        } else {
          const existingData = userSnap.data();
          await updateDoc(userRef, userData);
          setCurrentUserData({ ...existingData, ...userData });
          setProfileFullName(existingData.fullName || "");
          setProfilePhoneNumber(existingData.phoneNumber || "");
        }

        // Se for você (admin), tenta migrar os dados se o banco estiver vazio
        if (currentUser.email === "patamo17@gmail.com") {
          migrarVersiculosParaFirebase().catch(console.error);
          fetchUsers();
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList = usersSnap.docs.map(doc => doc.data());
      setAllUsers(usersList);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchVerses = async () => {
    setIsVersesLoading(true);
    try {
      const versesSnap = await getDocs(collection(db, "conselheirodaalma"));
      const versesList = versesSnap.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
      setAllVerses(versesList);
    } catch (error) {
      console.error("Erro ao buscar versículos:", error);
    } finally {
      setIsVersesLoading(false);
    }
  };

  const handleForceUpdate = async () => {
    if (!confirm("Isso irá atualizar TODOS os registros do banco com a nova linguagem neutra (ex: 'Alma querida') e remover o termo 'depressão'. Deseja continuar?")) return;
    
    setIsMaintenanceLoading(true);
    try {
      const colPath = 'conselheirodaalma';
      const snapshot = await getDocs(collection(db, colPath));
      const batchSize = 400;
      let count = 0;
      let currentBatch = writeBatch(db);

      const CATEGORIA_MAP: Record<string, string> = {
        "Tristeza e Depressão": "Tristeza Profunda e Angústia"
      };

      for (const item of snapshot.docs) {
        const data = item.data();
        let hasChanged = false;

        if (CATEGORIA_MAP[data.categoria]) {
          data.categoria = CATEGORIA_MAP[data.categoria];
          hasChanged = true;
        }

        if (data.sentimentos && Array.isArray(data.sentimentos)) {
          const oldSentimentos = JSON.stringify(data.sentimentos);
          data.sentimentos = data.sentimentos.map((s: string) => s === "depressão" ? "tristeza profunda" : s);
          if (oldSentimentos !== JSON.stringify(data.sentimentos)) hasChanged = true;
        }

        if (data.explicacao) {
          const oldEx = data.explicacao;
          data.explicacao = data.explicacao
            .replace(/Meu amado/g, "Alma querida")
            .replace(/meu amado/g, "alma querida")
            .replace(/depressão/g, "tristeza profunda")
            .replace(/Depressão/g, "Tristeza Profunda")
            .replace(/ansioso/g, "com ansiedade")
            .replace(/preocupado/g, "com preocupação")
            .replace(/cansado/g, "com cansaço")
            .replace(/sozinho/g, "em solidão")
            .replace(/abatido/g, "com abatimento");
          
          if (oldEx !== data.explicacao) hasChanged = true;
        }

        if (hasChanged) {
          currentBatch.set(doc(db, colPath, item.id), data);
          count++;
          if (count % batchSize === 0) {
            await currentBatch.commit();
            currentBatch = writeBatch(db);
          }
        }
      }

      if (count % batchSize !== 0) await currentBatch.commit();
      alert(`Sucesso! ${count} registros foram atualizados e normalizados.`);
      fetchVerses();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar registros. Verifique os logs do console.");
    } finally {
      setIsMaintenanceLoading(false);
    }
  };

  const handleAddPdfVerses = async () => {
    if (user?.email !== "patamo17@gmail.com") {
      alert("Apenas o administrador master (patamo17@gmail.com) pode realizar esta sincronização.");
      return;
    }

    // confirm() is blocked in sandbox, so we use alert or just proceed with safety check in UI
    // For now, let's proceed and handle the error, since this is a protected admin action
    
    setIsMaintenanceLoading(true);
    console.log("Iniciando sincronização via PDF. Usuário logado:", user?.email, "UID:", user?.uid);
    try {
      const colPath = 'conselheirodaalma';
      
      // 1. Limpeza Total
      console.log("Limpando coleção atual...");
      const snapshot = await getDocs(collection(db, colPath));
      let deleteCount = 0;
      
      if (snapshot.size > 0) {
        let deleteBatch = writeBatch(db);
        for (const d of snapshot.docs) {
          deleteBatch.delete(doc(db, colPath, d.id));
          deleteCount++;
          if (deleteCount % 400 === 0) {
            await deleteBatch.commit();
            deleteBatch = writeBatch(db);
          }
        }
        if (deleteCount > 0 && deleteCount % 400 !== 0) await deleteBatch.commit();
      }
      console.log(`${deleteCount} documentos removidos.`);

      // 2. Adição dos novos (V001-V100)
      if (!bancoVersiculos || !bancoVersiculos.versiculos || bancoVersiculos.versiculos.length === 0) {
        console.error("Versículos não encontrados no arquivo JSON importado:", bancoVersiculos);
        throw new Error("Erro ao carregar o banco de versículos local ou arquivo está vazio.");
      }

      console.log(`Adicionando ${bancoVersiculos.versiculos.length} versículos...`);
      let addBatch = writeBatch(db);
      let addCount = 0;

      for (const v of bancoVersiculos.versiculos) {
        const docRef = doc(db, colPath, v.codigo);
        const data = {
          ...v,
          updatedAt: new Date()
        };

        addBatch.set(docRef, data);
        addCount++;

        if (addCount % 400 === 0) {
          await addBatch.commit();
          addBatch = writeBatch(db);
        }
      }
      if (addCount % 400 !== 0) await addBatch.commit();
      console.log(`Sucesso: ${addCount} versículos adicionados.`);

      alert(`Sucesso! Banco sincronizado: ${deleteCount} removidos, ${addCount} novos versículos do PDF adicionados.`);
      fetchVerses();
    } catch (error: any) {
      console.error("Erro detalhado no reset via PDF:", error);
      
      // Objeto de diagnóstico
      const debugInfo = {
        message: error?.message,
        code: error?.code,
        authEmail: user?.email,
        authUid: user?.uid,
        emailVerified: user?.emailVerified
      };
      console.log("Diagnóstico de Autenticação:", JSON.stringify(debugInfo, null, 2));

      let errorMessage = error?.message || "Erro desconhecido";
      if (errorMessage.includes("permission-denied") || error?.code === "permission-denied") {
        errorMessage = "Permissão negada no Firebase. Verifique se você está logado no App com o email patamo17@gmail.com.";
      }
      alert(`Erro ao sincronizar: ${errorMessage}`);
    } finally {
      setIsMaintenanceLoading(false);
    }
  };

  const handleSaveVerse = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingVerse) return;
    setIsVersesLoading(true);
    try {
      const verseRef = doc(db, "conselheirodaalma", editingVerse.firestoreId || editingVerse.codigo);
      const { firestoreId, ...dataToSave } = editingVerse;
      await setDoc(verseRef, dataToSave, { merge: true });
      setEditingVerse(null);
      fetchVerses();
    } catch (error) {
      console.error("Erro ao salvar versículo:", error);
    } finally {
      setIsVersesLoading(false);
    }
  };

  const handleDeleteVerse = async (firestoreId: string) => {
    if (!confirm("Tem certeza que deseja excluir este versículo?")) return;
    setIsVersesLoading(true);
    try {
      const { deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "conselheirodaalma", firestoreId));
      fetchVerses();
    } catch (error) {
      console.error("Erro ao excluir versículo:", error);
    } finally {
      setIsVersesLoading(false);
    }
  };

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isPremium: !currentStatus });
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Erro ao atualizar status premium:", error);
    }
  };

  const handleLogin = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      setAuthError("Erro ao entrar com Google.");
    }
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Erro no login:", error);
      setAuthError("E-mail ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!fullName || !phoneNumber) {
      setAuthError("Por favor, preencha todos os campos.");
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      setAuthError("Erro ao criar conta. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileMessage("");
    if (!user) return;
    setIsLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: profileFullName,
        phoneNumber: profilePhoneNumber
      });
      
      if (newPassword) {
        await updateAuthPassword(user, newPassword);
        setNewPassword("");
      }
      
      setCurrentUserData((prev: any) => ({ ...prev, fullName: profileFullName, phoneNumber: profilePhoneNumber }));
      setProfileMessage("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      setProfileMessage("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminView(false);
    setIsProfileView(false);
  };

  const speak = async (text: string, id: string) => {
    try {
      setIsAudioLoading(id);
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang.includes('pt-BR'));
        if (ptVoice) utterance.voice = ptVoice;

        utterance.onend = () => {
          setIsAudioLoading(null);
        };

        utterance.onerror = (event) => {
          console.error("SpeechSynthesisUtterance error:", event);
          setIsAudioLoading(null);
        };

        window.speechSynthesis.speak(utterance);
      } else {
        setIsAudioLoading(null);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsAudioLoading(null);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const messageText = typeof textOverride === 'string' ? textOverride : input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textOverride) setInput("");
    setIsLoading(true);

    try {
      const response = await getCounselFromDatabase(messageText);
      const assistantMessage: Message = {
        role: "assistant",
        content: response || "Desculpe, não consegui processar sua mensagem agora. Tente novamente em instantes.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Houve um erro ao buscar orientação. Por favor, tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const [isAudioLoading, setIsAudioLoading] = useState<string | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-natural-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-natural-olive" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-natural-bg flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 space-y-6 rounded-[40px] border-natural-olive/5 shadow-xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-natural-cream rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-natural-olive" />
            </div>
            <h2 className="text-2xl font-serif text-natural-olive">
              {authMode === 'login' ? 'Boas-vindas de volta' : 'Crie sua conta'}
            </h2>
          </div>

          <form onSubmit={authMode === 'login' ? handleEmailLogin : handleRegister} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-natural-sage ml-4">Nome Completo</label>
                  <Input 
                    placeholder="Seu nome completo" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="rounded-full bg-natural-bg border-natural-olive/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-natural-sage ml-4">Celular</label>
                  <Input 
                    placeholder="(00) 00000-0000" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-full bg-natural-bg border-natural-olive/10"
                  />
                </div>
              </>
            )}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-natural-sage ml-4">E-mail</label>
              <Input 
                type="email"
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full bg-natural-bg border-natural-olive/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-natural-sage ml-4">Senha</label>
              <Input 
                type="password"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full bg-natural-bg border-natural-olive/10"
              />
            </div>

            {authError && <p className="text-xs text-red-500 text-center">{authError}</p>}

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-natural-olive hover:bg-natural-olive/90 text-white"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (authMode === 'login' ? 'Entrar' : 'Cadastrar')}
            </Button>
          </form>

          <div className="relative">
            <Separator className="bg-natural-olive/10" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] text-natural-sage uppercase tracking-widest">ou</span>
          </div>

          <Button 
            onClick={handleLogin}
            variant="outline"
            className="w-full h-12 rounded-full border-natural-olive/10 text-natural-olive hover:bg-natural-olive/5 gap-2"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
            Entrar com Google
          </Button>

          <p className="text-center text-sm text-natural-sage">
            {authMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="ml-1 text-natural-olive font-semibold hover:underline"
            >
              {authMode === 'login' ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-natural-bg text-natural-ink font-sans selection:bg-natural-sand/30 overflow-x-hidden">
      {/* Background soft gradients from design */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-radial from-natural-olive/5 to-transparent blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-radial from-natural-sand/10 to-transparent blur-[80px]" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-2 py-4 md:px-4 md:py-16 h-[100dvh] flex flex-col overflow-x-hidden">
        <header className="text-center mb-6 md:mb-10 shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-serif font-normal text-natural-olive tracking-tight mb-2">
              Conselheiro da Alma
            </h1>
            <div className="text-[14px] md:text-[16px] uppercase tracking-[4px] text-natural-sage font-medium">
              Um refúgio de paz e orientação
            </div>
            {currentUserData?.isPremium && (
              <div className="flex justify-center mt-2">
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 rounded-full px-3">
                  <Crown className="w-3 h-3 fill-amber-500" />
                  Acesso PREMIUM
                </Badge>
              </div>
            )}
            {user?.email === "patamo17@gmail.com" && (
              <div className="mt-4 flex justify-center gap-3">
                <Button 
                  variant={!isAdminView && !isProfileView ? "default" : "outline"}
                  size="sm" 
                  onClick={() => { setIsAdminView(false); setIsProfileView(false); }}
                  className="rounded-full"
                >
                  Conselheiro
                </Button>
                <Button 
                  variant={isAdminView ? "default" : "outline"}
                  size="sm" 
                  onClick={() => { 
                    setIsAdminView(true); 
                    setIsProfileView(false); 
                    setAdminSubView('menu'); 
                    setUserSearchTerm("");
                    setVerseSearchTerm("");
                  }}
                  className="rounded-full gap-2"
                >
                  <Users className="w-4 h-4" />
                  ADMIN
                </Button>
              </div>
            )}
            <div className="absolute top-0 right-0 p-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => { setIsProfileView(!isProfileView); setIsAdminView(false); }}
                className="rounded-full w-12 h-12 border-natural-olive/20 text-natural-olive bg-white shadow-sm hover:bg-natural-cream hover:scale-105 transition-all"
              >
                <UserIcon className="w-6 h-6" />
              </Button>
            </div>
          </motion.div>
        </header>

        <Card className="flex-1 flex flex-col bg-white border-natural-olive/5 shadow-[0_20px_40px_rgba(0,0,0,0.03)] overflow-hidden rounded-[40px] relative">
          {isProfileView ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 md:p-10 border-b border-natural-olive/5 flex justify-between items-center bg-natural-cream/30">
                <div>
                  <h2 className="text-2xl font-serif text-natural-olive">Meu Perfil</h2>
                  <p className="text-natural-sage text-sm">Gerencie suas informações pessoais</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6 md:p-10">
                  <form onSubmit={handleUpdateProfile} className="max-w-md mx-auto space-y-6">
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-natural-cream overflow-hidden mb-4 shadow-inner">
                      <img 
                        src={currentUserData?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <Badge variant="outline" className="rounded-full border-natural-olive/20 text-natural-olive bg-white px-4 py-1">
                      {user.email}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-natural-olive uppercase tracking-wider ml-4 flex items-center gap-2">
                        <UserIcon className="w-3 h-3" /> Nome Completo
                      </label>
                      <Input 
                        value={profileFullName}
                        onChange={(e) => setProfileFullName(e.target.value)}
                        className="rounded-full bg-natural-bg border-natural-olive/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-natural-olive uppercase tracking-wider ml-4 flex items-center gap-2">
                        <Phone className="w-3 h-3" /> Celular
                      </label>
                      <Input 
                        value={profilePhoneNumber}
                        onChange={(e) => setProfilePhoneNumber(e.target.value)}
                        className="rounded-full bg-natural-bg border-natural-olive/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-natural-olive uppercase tracking-wider ml-4 flex items-center gap-2">
                        <Lock className="w-3 h-3" /> Nova Senha (opcional)
                      </label>
                      <Input 
                        type="password"
                        placeholder="Deixe em branco para não alterar"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="rounded-full bg-natural-bg border-natural-olive/10"
                      />
                    </div>
                  </div>

                  {profileMessage && (
                    <p className={`text-center text-sm ${profileMessage.includes('sucesso') ? 'text-green-600' : 'text-red-500'}`}>
                      {profileMessage}
                    </p>
                  )}

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-full bg-natural-olive hover:bg-natural-olive/90 text-white shadow-lg"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar Alterações'}
                  </Button>
                </form>
              </div>
            </ScrollArea>
            </div>
          ) : isAdminView ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 md:p-10 border-b border-natural-olive/5 flex justify-between items-center bg-natural-cream/30">
                <div className="flex items-center gap-4">
                  {adminSubView !== 'menu' && (
                    <Button variant="ghost" size="icon" onClick={() => { setAdminSubView('menu'); setUserSearchTerm(""); setVerseSearchTerm(""); }} className="rounded-full">
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  )}
                  <div>
                    <h2 className="text-2xl font-serif text-natural-olive">
                      {adminSubView === 'menu' ? 'Painel Admin' : adminSubView === 'users' ? 'Gerenciar Usuários' : 'Gerenciar Conteúdo'}
                    </h2>
                    <p className="text-natural-sage text-sm">
                      {adminSubView === 'menu' ? 'Escolha uma área para gerenciar' : adminSubView === 'users' ? 'Controle de acesso e status premium' : ''}
                    </p>
                  </div>
                </div>
                {adminSubView === 'users' && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Input 
                        placeholder="Buscar usuário..." 
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="rounded-full h-9 w-40 md:w-64 bg-white border-natural-olive/10 pl-9 text-xs"
                      />
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-natural-sage" />
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchUsers} disabled={isUsersLoading}>
                      <Loader2 className={`w-5 h-5 ${isUsersLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                )}
                {adminSubView === 'content' && !editingVerse && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Input 
                        placeholder="Buscar conteúdo..." 
                        value={verseSearchTerm}
                        onChange={(e) => setVerseSearchTerm(e.target.value)}
                        className="rounded-full h-9 w-40 md:w-64 bg-white border-natural-olive/10 pl-9 text-xs"
                      />
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-natural-sage" />
                    </div>
                    <Button 
                      onClick={() => setEditingVerse({ id: Date.now(), codigo: `V${Date.now()}`, categoria: 'Ansiedade e Preocupação', versiculo: '', referencia: '', explicacao: '', youtubeMusicUrl: '', sentimentos: [] })}
                      className="rounded-full bg-natural-olive text-white gap-2 h-9 px-4 text-xs"
                    >
                      <Plus className="w-4 h-4" /> Novo
                    </Button>
                  </div>
                )}
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 md:p-10">
                  {adminSubView === 'menu' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-4 md:pt-10">
                    <Button 
                      variant="outline" 
                      onClick={() => { setAdminSubView('users'); fetchUsers(); }}
                      className="h-32 md:h-40 rounded-[24px] md:rounded-[32px] flex flex-col gap-3 md:gap-4 border-natural-olive/10 hover:bg-natural-olive/5 hover:border-natural-olive/30 transition-all p-4"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-natural-olive/10 flex items-center justify-center">
                        <Users className="w-5 h-5 md:w-6 md:h-6 text-natural-olive" />
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-lg md:text-xl text-natural-olive">Gerenciar Usuários</div>
                        <div className="text-[10px] md:text-xs text-natural-sage mt-1">Status premium e acessos</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => { setAdminSubView('content'); fetchVerses(); }}
                      className="h-32 md:h-40 rounded-[24px] md:rounded-[32px] flex flex-col gap-3 md:gap-4 border-natural-olive/10 hover:bg-natural-olive/5 hover:border-natural-olive/30 transition-all p-4"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-natural-olive/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-natural-olive" />
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-lg md:text-xl text-natural-olive">Conteúdo</div>
                        <div className="text-[10px] md:text-xs text-natural-sage mt-1">Versículos, textos e músicas</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={handleForceUpdate}
                      disabled={isMaintenanceLoading}
                      className="h-32 md:h-40 rounded-[24px] md:rounded-[32px] flex flex-col gap-3 md:gap-4 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all p-4"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        {isMaintenanceLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-orange-600 animate-spin" /> : <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />}
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-lg md:text-xl text-orange-800">Limpeza de Dados</div>
                        <div className="text-[10px] md:text-xs text-orange-600 mt-1">Neutralizar linguagem em massa</div>
                      </div>
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={handleAddPdfVerses}
                      disabled={isMaintenanceLoading}
                      className="h-32 md:h-40 rounded-[24px] md:rounded-[32px] flex flex-col gap-3 md:gap-4 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all p-4"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        {isMaintenanceLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 animate-spin" /> : <Plus className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />}
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-lg md:text-xl text-blue-800">Sincronizar Banco (PDF)</div>
                        <div className="text-[10px] md:text-xs text-blue-600 mt-1">Resetar para os 100 versículos acolhedores</div>
                      </div>
                    </Button>
                  </div>
                ) : adminSubView === 'users' ? (
                  <div className="space-y-4">
                    {(() => {
                      const filteredUsers = allUsers.filter(u => 
                        (u.displayName || u.fullName || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase())
                      );
                      
                      if (filteredUsers.length === 0) {
                        return (
                          <div className="text-center py-20 text-natural-sage italic">
                            {userSearchTerm ? 'Nenhum usuário encontrado para esta busca.' : 'Nenhum usuário cadastrado ainda.'}
                          </div>
                        );
                      }

                      return filteredUsers.map((u) => (
                        <div key={u.uid} className="flex items-center justify-between p-4 rounded-2xl border border-natural-olive/5 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <img src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} alt={u.displayName} className="w-12 h-12 rounded-full border-2 border-natural-cream" referrerPolicy="no-referrer" />
                            <div>
                              <div className="font-semibold text-natural-olive flex items-center gap-2">
                                {u.displayName || u.fullName || 'Usuário'}
                                {u.isPremium && <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />}
                              </div>
                              <div className="text-xs text-natural-sage">{u.email}</div>
                              <div className="text-[10px] text-natural-sage/60 mt-1">
                                Último acesso: {new Date(u.lastLogin).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={u.isPremium ? "destructive" : "default"}
                            size="sm"
                            onClick={() => togglePremium(u.uid, u.isPremium)}
                            className={`rounded-full gap-2 ${u.isPremium ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200" : "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"}`}
                          >
                            {u.isPremium ? (
                              <>
                                <X className="w-4 h-4" />
                                Remover Premium
                              </>
                            ) : (
                              <>
                                <Crown className="w-4 h-4" />
                                Tornar PREMIUM
                              </>
                            )}
                          </Button>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {editingVerse ? (
                      <Card className="p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-natural-olive/10 shadow-lg bg-natural-cream/10">
                        <form onSubmit={handleSaveVerse} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] md:text-xs font-bold text-natural-olive uppercase ml-2">Categoria</label>
                              <select 
                                value={editingVerse.categoria}
                                onChange={(e) => setEditingVerse({...editingVerse, categoria: e.target.value})}
                                className="w-full h-10 rounded-full border border-natural-olive/10 bg-white px-4 text-sm focus:ring-2 focus:ring-natural-olive outline-none"
                              >
                                {Object.keys(CATEGORIAS_KEYWORDS).map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] md:text-xs font-bold text-natural-olive uppercase ml-2">Referência</label>
                              <Input 
                                value={editingVerse.referencia}
                                onChange={(e) => setEditingVerse({...editingVerse, referencia: e.target.value})}
                                placeholder="Ex: João 3:16"
                                className="rounded-full border-natural-olive/10"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] md:text-xs font-bold text-natural-olive uppercase ml-2">Versículo</label>
                            <textarea 
                              value={editingVerse.versiculo}
                              onChange={(e) => setEditingVerse({...editingVerse, versiculo: e.target.value})}
                              placeholder="Texto do versículo..."
                              className="w-full h-24 rounded-2xl border border-natural-olive/10 bg-white p-4 text-sm focus:ring-2 focus:ring-natural-olive outline-none resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] md:text-xs font-bold text-natural-olive uppercase ml-2">Explicação</label>
                            <textarea 
                              value={editingVerse.explicacao}
                              onChange={(e) => setEditingVerse({...editingVerse, explicacao: e.target.value})}
                              placeholder="Explicação acolhedora..."
                              className="w-full h-32 rounded-2xl border border-natural-olive/10 bg-white p-4 text-sm focus:ring-2 focus:ring-natural-olive outline-none resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] md:text-xs font-bold text-natural-olive uppercase ml-2">Link YouTube Music (Auto-play)</label>
                            <Input 
                              value={editingVerse.youtubeMusicUrl}
                              onChange={(e) => setEditingVerse({...editingVerse, youtubeMusicUrl: e.target.value})}
                              placeholder="https://music.youtube.com/watch?v=..."
                              className="rounded-full border-natural-olive/10"
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button type="submit" className="flex-1 rounded-full bg-natural-olive text-white">
                              Salvar
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setEditingVerse(null)} className="flex-1 rounded-full border-natural-olive/10">
                              Cancelar
                            </Button>
                          </div>
                        </form>
                      </Card>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-2 pb-2">
                          {Object.keys(CATEGORIAS_KEYWORDS).map(cat => (
                            <Button
                              key={cat}
                              variant={selectedCategory === cat ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                              className={`rounded-full text-[10px] md:text-xs h-8 ${selectedCategory === cat ? "bg-natural-olive text-white" : "border-natural-olive/10 text-natural-olive"}`}
                            >
                              {cat}
                            </Button>
                          ))}
                        </div>

                        <div className="space-y-4">
                          {(() => {
                            let filteredVerses = allVerses;
                            
                            if (selectedCategory) {
                              filteredVerses = filteredVerses.filter(v => v.categoria === selectedCategory);
                            }

                            if (verseSearchTerm) {
                              filteredVerses = filteredVerses.filter(v => 
                                (v.referencia || '').toLowerCase().includes(verseSearchTerm.toLowerCase()) ||
                                (v.versiculo || '').toLowerCase().includes(verseSearchTerm.toLowerCase()) ||
                                (v.categoria || '').toLowerCase().includes(verseSearchTerm.toLowerCase())
                              );
                            }

                            if (!selectedCategory && !verseSearchTerm) {
                              return (
                                <div className="text-center py-12 md:py-20 text-natural-sage italic bg-natural-cream/20 rounded-[32px] border border-dashed border-natural-olive/10">
                                  <BookOpen className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                  Selecione uma categoria acima ou use a busca para ver o conteúdo.
                                </div>
                              );
                            }

                            if (filteredVerses.length === 0) {
                              return (
                                <div className="text-center py-12 md:py-20 text-natural-sage italic">
                                  Nenhum conteúdo encontrado para esta seleção.
                                </div>
                              );
                            }

                            return filteredVerses.map((v) => (
                              <div key={v.firestoreId} className="p-4 md:p-5 rounded-2xl border border-natural-olive/5 bg-white shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-2 md:mb-3">
                                  <div>
                                    <Badge className="bg-natural-cream text-natural-olive border-natural-sand/30 rounded-full mb-1 md:mb-2 text-[10px]">
                                      {v.categoria}
                                    </Badge>
                                    <h3 className="font-serif text-base md:text-lg text-natural-olive">{v.referencia}</h3>
                                  </div>
                                  <div className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" onClick={() => setEditingVerse(v)} className="rounded-full text-natural-olive hover:bg-natural-olive/5 h-8 w-8">
                                      <Edit className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteVerse(v.firestoreId)} className="rounded-full text-red-500 hover:bg-red-50 h-8 w-8">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-xs md:text-sm text-natural-ink italic line-clamp-2 mb-2">"{v.versiculo}"</p>
                                {v.youtubeMusicUrl && (
                                  <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-natural-sage">
                                    <Music className="w-3 h-3" /> Música configurada
                                  </div>
                                )}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <>
              {/* Decoration Leaf - Moved to background to not overlap messages */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl opacity-20 text-natural-olive z-0 pointer-events-none select-none">
                🍃
              </div>

              <ScrollArea className="flex-1 overflow-x-hidden relative z-10" ref={scrollAreaRef}>
                <div className="p-4 md:p-12">
                  <div className="space-y-8 md:space-y-10">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10 md:py-20">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-natural-bg flex items-center justify-center">
                    <Heart className="w-6 h-6 md:w-8 md:h-8 text-natural-olive/30" />
                  </div>
                  <p className="text-natural-sage text-base md:text-lg font-serif italic max-w-[280px] md:max-w-sm">
                    "Olá, que bom ter você aqui. Como está o seu coração hoje? Pode me contar tudo, estou aqui para te ouvir."
                  </p>
                </div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-center w-full"}`}
                  >
                    <div
                      className={`${
                        msg.role === "user"
                          ? "max-w-[80%] bg-natural-olive text-white rounded-[24px] rounded-tr-none p-5 shadow-md"
                          : "w-full max-w-2xl text-center"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="py-4">
                          {(() => {
                            const sections = {
                              verse: "",
                              explanation: "",
                              music: "",
                              audio: false
                            };

                            const verseMatch = msg.content.match(/📖 VERSÍCULO:\s*([\s\S]*?)(?=💬 EXPL[AI]NAÇÃO:|$)/i);
                            const explanationMatch = msg.content.match(/💬 EXPL[AI]NAÇÃO:\s*([\s\S]*?)(?=🎵 OUÇA AGORA:|$)/i);
                            const musicMatch = msg.content.match(/🎵 OUÇA AGORA:\s*([\s\S]*?)(?=🔊 VERSÍCULO EM ÁUDIO:|$)/i);
                            const audioMatch = msg.content.includes("🔊 VERSÍCULO EM ÁUDIO:");

                            if (verseMatch) sections.verse = verseMatch[1].trim();
                            if (explanationMatch) sections.explanation = explanationMatch[1].trim();
                            if (musicMatch) sections.music = musicMatch[1].trim();
                            sections.audio = audioMatch;

                            const { verse, explanation, music, audio } = sections;
                            if (!verse && !explanation && !music) return <p className="text-lg font-serif italic whitespace-pre-wrap">{msg.content}</p>;
                            
                            return (
                              <div className="flex flex-col items-center">
                                {verse && (
                                  <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                    <span className="text-[12px] md:text-[14px] font-bold text-natural-olive tracking-[1px] uppercase block">
                                      📖 VERSÍCULO
                                    </span>
                                    <p className="text-xl md:text-3xl font-serif italic text-natural-ink leading-relaxed px-2 md:px-10 whitespace-pre-wrap">
                                      {verse}
                                    </p>
                                  </div>
                                )}
                                
                                <div className="w-[40px] md:w-[60px] h-[1px] bg-natural-sand my-6 md:my-10" />
                                
                                {explanation && (
                                  <div className="max-w-[600px] mx-auto">
                                    <p className="text-base md:text-xl leading-relaxed text-[#555] font-light font-sans whitespace-pre-wrap">
                                      {explanation}
                                    </p>
                                  </div>
                                )}
                                
                                {music && (
                                  <div className="mt-12 flex flex-col items-center w-full">
                                    <div className="bg-natural-cream border border-natural-sand/30 rounded-2xl md:rounded-[32px] px-6 py-5 md:px-10 md:py-6 flex flex-col items-center gap-4 text-natural-olive shadow-sm hover:shadow-md transition-all">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-natural-olive/10 flex items-center justify-center">
                                          <Music className="w-5 h-5 text-natural-olive" />
                                        </div>
                                        <span className="uppercase tracking-[2px] font-bold text-xs">Música para sua Alma</span>
                                      </div>
                                      
                                      <div className="flex flex-col gap-4 w-full min-w-[240px]">
                                        {(() => {
                                          const ytMatch = music.match(/YouTube Music:\s*(https:\/\/\S+)/i);
                                          const spMatch = music.match(/Spotify:\s*(https:\/\/\S+)/i);
                                          const isDirectLink = ytMatch && ytMatch[1].includes('watch?v=');

                                          return (
                                            <div className="flex flex-col gap-3">
                                              {ytMatch && (
                                                <Button
                                                  asChild
                                                  className={`w-full rounded-full gap-2 ${isDirectLink ? 'bg-natural-olive text-white hover:bg-natural-olive/90' : 'bg-white text-natural-olive border border-natural-olive/10 hover:bg-natural-olive/5'}`}
                                                >
                                                  <a 
                                                    href={ytMatch[1]} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                  >
                                                    {isDirectLink ? <Sparkles className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                                                    {isDirectLink ? 'Ouvir no YouTube Music (Auto-play)' : 'Buscar no YouTube Music'}
                                                  </a>
                                                </Button>
                                              )}
                                              {spMatch && (
                                                <a 
                                                  href={spMatch[1]} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="text-center text-xs text-natural-olive/60 hover:text-natural-olive underline transition-colors"
                                                >
                                                  Também disponível no Spotify
                                                </a>
                                              )}
                                            </div>
                                          );
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {audio && verse && (
                                  <div className="mt-4 flex flex-col items-center gap-4">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      disabled={isAudioLoading === `verse-${idx}`}
                                      onClick={() => speak(verse, `verse-${idx}`)}
                                      className="rounded-full border-natural-olive/20 text-natural-olive hover:bg-natural-olive/5 gap-2"
                                    >
                                      {isAudioLoading === `verse-${idx}` ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Volume2 className="w-4 h-4" />
                                      )}
                                      Ouvir a Palavra
                                    </Button>

                                    {explanation && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        disabled={isAudioLoading === `expl-${idx}`}
                                        onClick={() => speak(explanation, `expl-${idx}`)}
                                        className="text-natural-olive/60 hover:text-natural-olive text-xs gap-2"
                                      >
                                        {isAudioLoading === `expl-${idx}` ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Volume2 className="w-3 h-3" />
                                        )}
                                        Ouvir Explicação
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <p className="text-base md:text-lg leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <div className="flex items-center gap-3 text-natural-sage italic">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Buscando paz na Palavra...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </ScrollArea>
        </>
      )}

      {!isAdminView && (
            <footer className="p-3 md:p-6 shrink-0 bg-white/80 backdrop-blur-sm border-t border-natural-olive/5">
              {messages.length === 0 && (
                <div className="max-w-2xl mx-auto mb-4 flex flex-wrap justify-center gap-2">
                  {SENTIMENTOS_TAGS.map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSend(tag)}
                      className="rounded-full text-[10px] md:text-sm border-natural-olive/10 text-natural-olive hover:bg-natural-olive/5 bg-white/50"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              )}
              <div className="relative flex items-center max-w-2xl mx-auto w-full gap-2">
                <div className="relative flex-1 flex items-center">
                  <Input
                    placeholder="Diga o que seu coração está sentindo"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="w-full h-12 md:h-14 bg-white border-natural-olive/10 focus-visible:ring-natural-olive rounded-full px-5 md:px-6 text-sm md:text-base italic font-sans placeholder:text-[#B0B0A0] shadow-sm transition-all"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 w-9 h-9 md:w-10 md:h-10 rounded-full bg-natural-olive hover:bg-natural-olive/90 text-white shadow-md disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </Button>
                </div>
              </div>
            </footer>
          )}
        </Card>
      </main>
    </div>
  );
}
