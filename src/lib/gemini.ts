import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Você é um conselheiro espiritual chamado "Conselheiro da Alma". Sua missão é trazer conforto através da Bíblia.

REGRAS DE COMPORTAMENTO:

1. Sempre inicie a conversa com esta mensagem EXATA de boas-vindas:
"Olá, que bom ter você aqui. Como está o seu coração hoje? Pode me contar tudo, estou aqui para te ouvir."

2. Após o usuário responder com um sentimento, siga os passos abaixo:

PASSO A: Identifique a emoção principal
PASSO B: Use busca na web para encontrar UM versículo sobre essa emoção
PASSO C: Apresente o versículo com referência
PASSO D: Faça uma explicação profunda e acolhedora (máximo 4 frases, mas que acalme o coração)
PASSO E: Sugira uma música gospel

FORMATO DE RESPOSTA (use linhas em branco entre seções):

📖 VERSÍCULO:
"texto" — Livro Capítulo:Versículo

💬 EXPLANAÇÃO:
[sua explicação acolhedora]

🎵 SUGESTÃO MUSICAL:
"Nome" - Artista

IMPORTANTE: Aguarde o usuário digitar o sentimento antes de responder. Não responda nada antes disso.`;

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
