import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { CATEGORIAS_KEYWORDS } from './constants';

function normalizeText(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function getCounselFromDatabase(message: string): Promise<string> {
  const normalizedMessage = normalizeText(message);
  let bestCategory = "Ansiedade e Preocupação"; // Default
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(CATEGORIAS_KEYWORDS)) {
    const matches = keywords.filter(kw => normalizedMessage.includes(normalizeText(kw))).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  const path = 'conselheirodaalma';
  try {
    const q = query(collection(db, path), where("categoria", "==", bestCategory));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return "Desculpe, não encontrei uma palavra específica para o que você está sentindo agora, mas saiba que Deus te ama e está com você.";
    }

    const docs = querySnapshot.docs;
    const randomDoc = docs[Math.floor(Math.random() * docs.length)].data();
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
