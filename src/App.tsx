import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Heart, BookOpen, Music, Sparkles, Loader2, Mic, Square, Volume2 } from "lucide-react";
import { getCounsel, generateAudio } from "@/src/lib/gemini";
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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activePlayer, setActivePlayer] = useState<{ type: 'youtube' | 'spotify'; query: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [isAudioLoading, setIsAudioLoading] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const speak = async (text: string, id: string) => {
    try {
      setIsAudioLoading(id);
      const base64Audio = await generateAudio(text);
      
      if (!base64Audio) {
        // Fallback to browser TTS if Gemini fails
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'pt-BR';
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
        return;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioContext = audioContextRef.current;
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const int16Data = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16Data.length);
      for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
      }
      
      const buffer = audioContext.createBuffer(1, float32Data.length, 24000);
      buffer.getChannelData(0).set(float32Data);
      
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsAudioLoading(null);
    }
  };

  const handleSend = async (textOverride?: string, audioData?: { data: string; mimeType: string }) => {
    const messageText = typeof textOverride === 'string' ? textOverride : input;
    if ((!messageText.trim() && !audioData) || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: audioData ? "🎤 Mensagem de áudio enviada" : messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textOverride) setInput("");
    setIsLoading(true);

    try {
      const response = await getCounsel(messageText, audioData);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          handleSend("", { data: base64Audio, mimeType });
        };
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Não foi possível acessar o microfone. Por favor, verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

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
            <div className="text-[12px] uppercase tracking-[3px] text-natural-sage font-semibold mb-2">
              Um refúgio de paz e orientação
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-normal text-natural-olive tracking-tight">
              Acolhedor
            </h1>
          </motion.div>
        </header>

        <Card className="flex-1 flex flex-col bg-white border-natural-olive/5 shadow-[0_20px_40px_rgba(0,0,0,0.03)] overflow-hidden rounded-[40px] relative">
          {/* Decoration Leaf */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-3xl opacity-60 text-natural-sand z-20 pointer-events-none">
            🍃
          </div>

          <ScrollArea className="flex-1 p-4 md:p-12 overflow-x-hidden" ref={scrollAreaRef}>
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
                                    <div className="bg-natural-cream border border-natural-sand/30 rounded-2xl md:rounded-full px-5 py-4 md:px-7 md:py-4 flex flex-col items-center gap-3 text-natural-olive font-semibold text-sm mb-4">
                                      <div className="flex items-center gap-2">
                                        <Music className="w-4 h-4" />
                                        <span className="uppercase tracking-wider">🎵 OUÇA AGORA</span>
                                      </div>
                                      <div className="flex flex-col gap-3 w-full">
                                        {(() => {
                                          const ytMatch = music.match(/YouTube Music:\s*(https:\/\/\S+)/i);
                                          const spMatch = music.match(/Spotify:\s*(https:\/\/\S+)/i);
                                          return (
                                            <div className="flex flex-wrap justify-center gap-4">
                                              {ytMatch && (
                                                <a 
                                                  href={ytMatch[1]} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="flex items-center gap-2 text-xs text-natural-olive/80 hover:text-natural-olive underline transition-colors"
                                                >
                                                  YouTube Music
                                                </a>
                                              )}
                                              {spMatch && (
                                                <a 
                                                  href={spMatch[1]} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="flex items-center gap-2 text-xs text-natural-olive/80 hover:text-natural-olive underline transition-colors"
                                                >
                                                  Spotify
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
                                          <Mic className="w-3 h-3" />
                                        )}
                                        Ouvir Explicação (Voz Cid Moreira)
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
          </ScrollArea>

          <footer className="p-3 md:p-6 shrink-0 bg-white/80 backdrop-blur-sm border-t border-natural-olive/5">
            <div className="relative flex items-center max-w-2xl mx-auto w-full gap-2">
              <div className="relative flex-1 flex items-center">
                <Input
                  placeholder={isRecording ? "Gravando áudio..." : "Desabafe aqui..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={isRecording}
                  className="w-full h-12 md:h-14 bg-white border-natural-olive/10 focus-visible:ring-natural-olive rounded-full px-5 md:px-6 text-sm md:text-base italic font-sans placeholder:text-[#B0B0A0] shadow-sm transition-all"
                />
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading || isRecording}
                  className="absolute right-1.5 w-9 h-9 md:w-10 md:h-10 rounded-full bg-natural-olive hover:bg-natural-olive/90 text-white shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </Button>
              </div>
              
              <Button
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg transition-all shrink-0 ${
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" 
                    : "bg-natural-cream border border-natural-olive/10 text-natural-olive hover:bg-natural-sand/20"
                }`}
              >
                {isRecording ? <Square className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
              </Button>
            </div>
          </footer>
        </Card>
      </main>
    </div>
  );
}
