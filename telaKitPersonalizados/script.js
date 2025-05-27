const API_URL = "https://site-cha-e-encantos-production.up.railway.app";
let produtos = [];
let produtosSelecionados = [];

import { login, logout, checaLogin } from '../APIs/autenticacao.js';
import { db } from '../APIs/autenticacao.js'; // exporta db no autenticacao.js
import { doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function pegarToken() {
    const user = await checaLogin();
    if(!user) return null;

    const token = await user.getIdToken();
    return {token, uid: user.uid};
}

window.onload = async () => {
    await verificarAdmin();
    await carregarProdutos();
};

async function verificarAdmin() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Acesso negado. Faça login.");
        window.location.href = "../telaMenu/Menu.html";
    }
}

async function carregarProdutos() {
    try {
        const res = await fetch(`${API_URL}/produtos`);
        produtos = await res.json();
        const lista = document.getElementById("produtos-lista");
        lista.innerHTML = "";

        produtos.forEach(prod => {
            const div = document.createElement("div");
            div.className = "produto-item";
            div.innerHTML = `
                <span>${prod.nome} - R$ ${parseFloat(prod.preco).toFixed(2)}</span>
                <input type="checkbox" value="${prod.nome}" data-preco="${prod.preco}" onchange="atualizarTotal()"/>
            `;
            lista.appendChild(div);
        });
    } catch (error) {
        alert("Erro ao carregar produtos");
    }
}

window.atualizarTotal = atualizarTotal;

function atualizarTotal() {
    const checkboxes = document.querySelectorAll("#produtos-lista input[type=checkbox]");
    let total = 0;
    produtosSelecionados = [];

    checkboxes.forEach(cb => {
        if (cb.checked) {
            total += parseFloat(cb.dataset.preco);
            produtosSelecionados.push(cb.value);
        }
    });

    const totalComDesconto = total * 0.9;
    document.getElementById("valor-total").innerText = totalComDesconto.toFixed(2);
}


async function adicionarCarrinhoFirestore(id, nome, preco) {
    const user = await checaLogin();
    if (!user) {
        alert('Faça login para adicionar ao carrinho.');
        return;
    }

    const itemRef = doc(db, "usuarios", user.uid, "carrinho", id);
    const userRef = doc(db, "usuarios", user.uid);

    try {
        const itemSnap = await getDoc(itemRef);
        const userSnap = await getDoc(userRef);

        if(!userSnap.exists() || userSnap.data().totalCarrinho === undefined){
            await setDoc(userRef, { totalCarrinho: 0 }, { merge: true });
        }

        if (itemSnap.exists()) {
            await updateDoc(itemRef, {
                quantidade: increment(1),
                subtotal: increment(preco)
            });
        } else {
            await setDoc(itemRef, {
                nome,
                precoUnitario: preco,
                quantidade: 1,
                subtotal: preco
            });
        }

        await updateDoc(userRef, {
            totalCarrinho: increment(preco)
        });

    } catch (erro) {
        console.error('Erro ao adicionar no carrinho:', erro);
        alert('Erro ao adicionar no carrinho.');
        throw erro;
    }
}



async function adicionarKitAoCarrinho(kit) {
  const user = await checaLogin();
    if (!user) {
        alert('Faça login para adicionar ao carrinho.');
        return;
    }

    const kitId = `kit-${Date.now()}`; // ID único baseado em timestamp
    const itemRef = doc(db, "usuarios", user.uid, "carrinho", kitId);
    const userRef = doc(db, "usuarios", user.uid);

    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data().totalCarrinho === undefined) {
            await setDoc(userRef, { totalCarrinho: 0 }, { merge: true });
        }

        await setDoc(itemRef, {
            nome: kit.nome,
            produtos: kit.produtos,
            quantidade: 1,
            subtotal: kit.valor
        });

        await updateDoc(userRef, {
            totalCarrinho: increment(kit.valor)
        });

        alert("Kit personalizado adicionado ao carrinho!");
        window.location.reload();

    } catch (erro) {
        console.error('Erro ao adicionar kit no carrinho:', erro);
        alert('Erro ao adicionar kit no carrinho.');
        throw erro;
    }
}



document.getElementById("kit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (produtosSelecionados.length === 0) {
        alert("Selecione pelo menos um produto.");
        return;
    }

    const kit = {
        nome: "kit personalizado",
        produtos: produtosSelecionados,
        valor: parseFloat(document.getElementById("valor-total").innerText)
    };

    try {
        await adicionarKitAoCarrinho(kit);
    } catch {
        alert("Erro ao adicionar kit ao carrinho")
    }

});


