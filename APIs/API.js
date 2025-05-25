

import { db } from "../firebase.js";
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";


//cria (adicionar)
export async function adicionarDocumento(colecao, dados) {
  const docRef = await addDoc(collection(db, colecao), dados);
  return docRef.id;
}

//lista todos os produtos
export async function listarDocumentos(colecao) {
  const querySnapshot = await getDocs(collection(db, colecao));
  const produtos = [];
  querySnapshot.forEach((doc) => {
    produtos.push({ id: doc.id, ...doc.data() });
  });
  return produtos;
}

//ler um produto pelo ID
export async function buscarDocumentosPorId(colecao,id) {
  try{
    const docRef = doc(db, colecao, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Produto não encontrado!");
    }
  } catch (error) {
    console.error("Erro buscarProdutoPorId: ", error);
    throw new Error(error.message || "Erro desconhecido");
  }
}

//Atualizar (Por ID)
export async function atualizarDocumntos(colecao,id, dadosAtualizados) {
  const docRef = doc(db, colecao, id);
  await updateDoc(docRef, dadosAtualizados);
  return "Produto atualizado com sucesso";
}

//Deletar (Por ID)
export async function deletarDocumentos(colecao,id) {
  const docRef = doc(db, colecao, id);
  await deleteDoc(docRef);
  return "Produto deletado com sucesso";
}
