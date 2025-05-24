import { db } from './firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';

async function testFirebaseConnection() {
  try {
    // Adiciona um documento teste na coleção "test"
    const docRef = await addDoc(collection(db, 'test'), {
      mensagem: 'Conexão com Firebase OK',
      timestamp: new Date().toISOString()
    });
    console.log('Documento escrito com ID:', docRef.id);

    // Lê os documentos da coleção "test"
    const querySnapshot = await getDocs(collection(db, 'test'));
    querySnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });

    console.log('Conexão e operações com Firebase Firestore funcionando!');
  } catch (error) {
    console.error('Erro ao conectar ou operar no Firebase:', error);
  }
}

testFirebaseConnection();
