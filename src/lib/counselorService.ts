import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const CATEGORIAS_KEYWORDS: Record<string, string[]> = {
  "Ansiedade e Preocupação": ["ansiedade", "preocupação", "nervosismo", "medo do futuro", "ansioso", "preocupado", "aflição", "inquieto"],
  "Medo e Insegurança": ["medo", "insegurança", "pavor", "incerteza", "assustado", "inseguro", "temor", "receio"],
  "Tristeza e Depressão": ["tristeza", "desânimo", "angústia", "depressão", "triste", "abatido", "choro", "chorando", "infeliz"],
  "Solidão e Abandono": ["solidão", "vazio", "abandono", "rejeição", "sozinho", "abandonado", "isolado"],
  "Cansaço e Desânimo": ["cansaço", "fadiga", "esgotamento", "falta de força", "cansado", "exausto", "sem forças", "fraco"],
  "Perda e Luto": ["luto", "perda", "saudade", "dor da separação", "morreu", "faleceu", "morte", "partiu"],
  "Gratidão e Alegria": ["gratidão", "alegria", "felicidade", "louvor", "feliz", "obrigado", "agradecido", "vitoria"],
  "Perdão e Culpa": ["culpa", "perdão", "arrependimento", "condenação", "culpado", "perdoar", "erro", "falha"],
  "Direção e Decisões": ["direção", "decisão", "escolha", "confusão", "duvida", "caminho", "orientação", "passo"],
  "Providência e Finanças": ["escassez", "finanças", "provisão", "necessidade", "dinheiro", "falta", "contas", "trabalho", "emprego"]
};

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

    // Formatar a resposta no padrão esperado pela UI
    return `📖 VERSÍCULO:
"${randomDoc.versiculo}" — ${randomDoc.referencia}

💬 EXPLANAÇÃO:
${randomDoc.explicacao}

🎵 OUÇA AGORA:

YouTube Music: https://music.youtube.com/search?q=${encodeURIComponent(randomDoc.categoria + " gospel")}

Spotify: https://open.spotify.com/search/${encodeURIComponent(randomDoc.categoria + " gospel")}

🔊 VERSÍCULO EM ÁUDIO:
[Clique para ouvir a Palavra]`;

  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return "Houve um erro ao buscar sua orientação no banco de dados.";
  }
}
