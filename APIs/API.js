

import { doc } from "firebase/firestore/lite";
import { db } from "../firebase.js";
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
const colecao = "produtos";

//cria (adicionar)
export async function adicionarProduto(dados) {
  const docRef = await addDoc(collection(db, colecao), dados);
  return docRef.id;
}

//lista todos os produtos
export async function listarProdutos() {
  const querySnapshot = await getDocs(collection(db, colecao));
  const produtos = [];
  querySnapshot.forEach((doc) => {
    produtos.push({ id: doc.id, ...doc.data() });
  });
  return produtos;
}

//ler um produto pelo ID
export async function buscarProdutoPorId(id) {
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
export async function atualizarProduto(id, dadosAtualizados) {
  const docRef = doc(db, colecao, id);
  await updateDoc(docRef, dadosAtualizados);
  return "Produto atualizado com sucesso";
}

//Deletar (Por ID)
export async function deletarProduto(id) {
  const docRef = doc(db, colecao, id);
  await deleteDoc(docRef);
  return "Produto deletado com sucesso";
}
