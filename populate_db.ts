
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load config
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const baseVerses = [
  { ref: "Filipenses 4:6", text: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus." },
  { ref: "1 Pedro 5:7", text: "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês." },
  { ref: "Salmos 37:5", text: "Entregue o seu caminho ao Senhor; confie nele, e ele agirá." },
  { ref: "João 14:27", text: "Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá. Não se perturbem os seus corações, nem tenham medo." },
  { ref: "Salmos 94:19", text: "Quando a ansiedade já dominava o meu íntimo, o teu consolo trouxe alívio à minha alma." },
  { ref: "Salmos 46:10", text: "Aquietem-se e saibam que eu sou Deus; serei exaltado entre as nações, serei exaltado na terra." },
  { ref: "Salmos 34:5", text: "Os que olham para ele estão radiantes de alegria; seus rostos jamais mostrarão decepção." },
  { ref: "Provérbios 12:25", text: "O coração ansioso deprime o homem, mas uma palavra bondosa o anima." },
  { ref: "Mateus 6:34", text: "Portanto, não se preocupem com o amanhã, pois o amanhã trará as suas próprias preocupações. Basta a cada dia o seu próprio mal." },
  { ref: "Mateus 11:28", text: "Venham a mim, todos os que estão cansados e sobrecarregados, e eu lhes darei descanso." }
];

const categories = [
  "Ansiedade e Preocupação",
  "Medo e Insegurança",
  "Tristeza e Desânimo",
  "Solidão e Abandono",
  "Cansaço e Esgotamento",
  "Perda e Luto",
  "Gratidão e Alegria",
  "Perdão e Culpa",
  "Direção e Decisões",
  "Proteção e Provisão"
];

const pdfExplica = "Este versículo traz uma mensagem de esperança e acolhimento. Mesmo em meio às dificuldades, existe cuidado, paz e amor disponíveis para você. Respire fundo e lembre-se de que você não está sozinho. Dias melhores virão, e há força dentro de você para continuar caminhando.";

async function populate() {
  const colPath = 'conselheirodaalma';
  
  console.log("Cleaning historical data...");
  const snapshot = await getDocs(collection(db, colPath));
  let deleteBatch = writeBatch(db);
  let deleteCount = 0;
  for (const d of snapshot.docs) {
    deleteBatch.delete(doc(db, colPath, d.id));
    deleteCount++;
    if (deleteCount % 400 === 0) {
      await deleteBatch.commit();
      deleteBatch = writeBatch(db);
    }
  }
  if (deleteCount % 400 !== 0) await deleteBatch.commit();
  console.log(`Removed ${deleteCount} old records.`);

  console.log("Adding 100 new verses...");
  let addBatch = writeBatch(db);
  let addCount = 0;

  for (let i = 0; i < 100; i++) {
    const catIndex = Math.floor(i / 10);
    const verseIndex = i % 10;
    const code = `V${(i + 1).toString().padStart(3, '0')}`;
    
    const data = {
      id: i + 1,
      codigo: code,
      categoria: categories[catIndex],
      referencia: baseVerses[verseIndex].ref,
      versiculo: baseVerses[verseIndex].text,
      explicacao: pdfExplica,
      sentimentos: ["esperança", "paz", "cuidado"],
      updatedAt: new Date().toISOString()
    };

    addBatch.set(doc(db, colPath, code), data);
    addCount++;

    if (addCount % 400 === 0) {
      await addBatch.commit();
      addBatch = writeBatch(db);
    }
  }
  if (addCount % 400 !== 0) await addBatch.commit();
  console.log(`Successfully added ${addCount} verses.`);
}

populate().catch(console.error);
