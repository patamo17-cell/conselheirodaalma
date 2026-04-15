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
      batch.set(docRef, v);
    });

    await batch.commit();
    console.log("Migração concluída com sucesso!");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function exportarFaixaDeVersiculos(minId: number, maxId: number) {
  if (!auth.currentUser) {
    throw new Error("Você precisa estar logado para exportar os dados.");
  }

  const path = 'conselheirodaalma';
  try {
    const batch = writeBatch(db);
    let count = 0;
    
    bancoVersiculos.versiculos.forEach((v) => {
      if (v.id >= minId && v.id <= maxId) {
        const docRef = doc(db, path, v.codigo);
        batch.set(docRef, v);
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
      console.log(`${count} versículos exportados com sucesso!`);
      return `${count} versículos exportados com sucesso!`;
    } else {
      return "Nenhum versículo encontrado na faixa especificada.";
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}
