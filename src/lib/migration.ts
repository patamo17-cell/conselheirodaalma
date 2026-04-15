import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { collection, writeBatch, doc, getDocs } from 'firebase/firestore';
import bancoVersiculos from '../../banco_versiculos.json';

export async function migrarVersiculosParaFirebase() {
  if (!auth.currentUser) {
    throw new Error("Você precisa estar logado para migrar os dados.");
  }

  const path = 'conselheirodaalma';
  try {
    // Verificar se já existem versículos para evitar duplicidade
    const snapshot = await getDocs(collection(db, path));
    if (!snapshot.empty) {
      console.log("Banco já populado no Firebase. Pulando migração.");
      return;
    }

    const batch = writeBatch(db);
    
    bancoVersiculos.versiculos.forEach((v) => {
      const docRef = doc(db, path, v.codigo); // Usamos o código como ID do documento
      
      // Adicionar um link de exemplo para teste se for da categoria Ansiedade
      const data: any = { ...v };
      if (v.categoria === "Ansiedade e Preocupação") {
        data.youtubeMusicUrl = "https://music.youtube.com/watch?v=dQw4w9WgXcQ"; // Exemplo (Rick Astley para teste, mude depois)
      }
      
      batch.set(docRef, data);
    });

    await batch.commit();
    console.log("Migração concluída com sucesso!");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
