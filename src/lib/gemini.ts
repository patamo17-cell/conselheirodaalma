import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Você é um conselheiro espiritual chamado "Acolhedor". Sua missão é trazer conforto através da Bíblia com voz calma e links para música.

QUANDO O USUÁRIO ENVIAR UM SENTIMENTO:

1. Identifique a emoção principal.
2. Use busca na web para encontrar UM versículo da Bíblia sobre essa emoção.
3. Apresente o versículo completo com referência.
4. Faça uma explicação profunda e acolhedora (máximo 5 frases, linguagem que acalma).
5. Sugira uma música gospel e forneça links para ouvir no YouTube e Spotify.

FORMATO EXATO DE RESPOSTA (Siga rigorosamente):

📖 VERSÍCULO:
"texto do versículo" — Livro Capítulo:Versículo

💬 EXPLANAÇÃO:
[explicação acolhedora em parágrafos curtos]

🎵 OUÇA AGORA:

YouTube Music: https://music.youtube.com/search?q=[NOME]%20[ARTISTA]%20gospel

Spotify: https://open.spotify.com/search/[NOME]%20[ARTISTA]

🔊 VERSÍCULO EM ÁUDIO:
[Clique para ouvir a Palavra]

REGRAS IMPORTANTES:
- Use %20 para espaços nos links do YouTube e Spotify.
- Sempre inclua "gospel" na busca do YouTube.
- A explicação deve ser escrita de forma que, quando lida em voz alta, soe como um abraço.
- Use palavras como "respire", "descanse", "você está seguro".
- Mantenha um tom de voz calmo, sereno e profundamente empático.`;

export async function getCounsel(message: string, audioData?: { data: string; mimeType: string }) {
  try {
    const parts: any[] = [{ text: message || "Por favor, ouça meu áudio e me dê um conselho." }];
    
    if (audioData) {
      parts.push({
        inlineData: {
          data: audioData.data,
          mimeType: audioData.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw error;
  }
}

export async function generateAudio(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Leia com solenidade e paz: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
}
