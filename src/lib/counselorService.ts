import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CATEGORIAS_KEYWORDS, SENTIMENTOS_TAGS } from './constants';

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function getCounselFromDatabase(message: string): Promise<string> {
  const normalizedMessage = normalizeText(message);
  
  // 1. Identificar sentimentos específicos mencionados (Tags)
  const matchedSentiments = SENTIMENTOS_TAGS.filter(tag => 
    normalizedMessage.includes(normalizeText(tag))
  );

  // 2. Identificar categorias candidatas com base em palavras-chave
  const categoryCandidates: { category: string; weight: number }[] = [];

  for (const [category, keywords] of Object.entries(CATEGORIAS_KEYWORDS)) {
    const matches = keywords.filter(kw => normalizedMessage.includes(normalizeText(kw))).length;
    if (matches > 0) {
      categoryCandidates.push({ category, weight: matches });
    }
  }

  // Ordenar categorias por relevância
  categoryCandidates.sort((a, b) => b.weight - a.weight);
  
  const path = 'conselheirodaalma';
  try {
    let allMatchingDocs: any[] = [];
    
    // Prioridade 1: Buscar por sentimentos específicos (tags) se houver
    if (matchedSentiments.length > 0) {
      // Nota: Firestore limita array-contains-any a 10 itens.
      const qSentiments = query(
        collection(db, path), 
        where("sentimentos", "array-contains-any", matchedSentiments.slice(0, 10))
      );
      const sentimentSnapshot = await getDocs(qSentiments);
      allMatchingDocs = [...sentimentSnapshot.docs.map(d => d.data())];
    }

    // Prioridade 2: Adicionar versículos das categorias identificadas
    const targetCategories = categoryCandidates.length > 0 
      ? categoryCandidates.slice(0, 2).map(c => c.category) 
      : (allMatchingDocs.length === 0 ? ["Ansiedade e Preocupação", "Medo e Insegurança", "Tristeza e Desânimo"] : []);

    for (const category of targetCategories) {
      const q = query(collection(db, path), where("categoria", "==", category));
      const querySnapshot = await getDocs(q);
      const categoryDocs = querySnapshot.docs.map(d => d.data());
      
      // Evitar duplicados se já vieram pelos sentimentos
      const existingIds = new Set(allMatchingDocs.map(d => d.codigo));
      categoryDocs.forEach(doc => {
        if (!existingIds.has(doc.codigo)) {
          allMatchingDocs.push(doc);
        }
      });
    }
    
    if (allMatchingDocs.length === 0) {
      // Fallback total
      const fallbackSnapshot = await getDocs(collection(db, path));
      allMatchingDocs = fallbackSnapshot.docs.map(d => d.data());
    }

    if (allMatchingDocs.length === 0) {
      return "Desculpe, não encontrei uma palavra específica para o que você está sentindo agora, mas saiba que Deus te ama e está com você.";
    }

    // RANDOMIZAÇÃO FINAL
    // Embaralhar a lista para garantir aleatoriedade máxima
    const randomDoc = allMatchingDocs[Math.floor(Math.random() * allMatchingDocs.length)];
    let musicUrl = randomDoc.youtubeMusicUrl || `https://music.youtube.com/search?q=${encodeURIComponent(randomDoc.categoria + " gospel")}`;
    
    // Adicionar autoplay se for um link direto de música
    if (musicUrl.includes('watch?v=') && !musicUrl.includes('autoplay=')) {
      musicUrl += musicUrl.includes('?') ? '&autoplay=1' : '?autoplay=1';
    }

    // Formatar a resposta no padrão esperado pela UI
    return `📖 VERSÍCULO:
"${randomDoc.versiculo}" — ${randomDoc.referencia}

💬 EXPLANAÇÃO:
${randomDoc.explicacao}

🎵 OUÇA AGORA:

YouTube Music: ${musicUrl}

Spotify: https://open.spotify.com/search/${encodeURIComponent(randomDoc.categoria + " gospel")}

🔊 VERSÍCULO EM ÁUDIO:
[Clique para ouvir a Palavra]`;

  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return "Houve um erro ao buscar sua orientação no banco de dados.";
  }
}
