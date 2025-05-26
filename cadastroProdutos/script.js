import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSkzmG4PkefRFdvmDQopUlibyhonBI0t4",
    authDomain: "site-cha-e-encantos.firebaseapp.com",
    projectId: "site-cha-e-encantos",
    storageBucket: "site-cha-e-encantos.firebasestorage.app",
    messagingSenderId: "983006416430",
    appId: "1:983006416430:web:8dbba5a8f82aacd19f59bf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '../telaMenu/Menu.html';
    return;
  }

  currentUser = user;

  user.getIdToken().then((token) => {
    localStorage.setItem('token', token)
  });

  const email = user.email;
  const listaAdmins = ['fonsecavinicius12@gmail.com', 'alinediasmarquesramos638@gmail.com'];
  if(!listaAdmins.includes(email)) {
    alert('Acesso negado. Página restrita a administradores.');
    window.location.href = '../telaMenu/Menu.html';
  }
});

const token = localStorage.getItem('token'); 

const form = document.getElementById('formProduto');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    let categoria = document.getElementById('categorias').value.split(',').map(cat => cat.trim());
    const preco = parseFloat(document.getElementById('preco').value);
    const descricao = document.getElementById('descricao').value.trim();
    const estoque = parseInt(document.getElementById('estoque').value);
    const imagemCaminho = document.getElementById('imagemCaminho').value.trim();

    const chaVovo = document.getElementById('chaVovo').checked;

    if(chaVovo){
      categoria.push("chá da vovó")
    }

    const ativo = document.getElementById('ativo').checked;
    const destaque = document.getElementById('destaque').checked;


    if (!nome || categorias.length === 0 || isNaN(preco) || !descricao || isNaN(estoque) || !imagemCaminho) {
        mensagem.textContent = "Preencha todos os campos corretamente.";
        return;
    }




  const produto = {
    nome,
    categoria,
    preco,
    descricao,
    estoque,
    imagemCaminho,
    ativo,
    destaque
  };

  try {
    const response = await fetch('https://site-cha-e-encantos-production.up.railway.app/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
      body: JSON.stringify(produto)
    });

    const data = await response.json();

    if (response.ok) {
      mensagem.innerText = 'Produto cadastrado com sucesso! ID: ' + data.id;
      form.reset();
    } else {
      mensagem.innerText = 'Erro: ' + data.error;
    }

  } catch (error) {
    mensagem.innerText = 'Erro na requisição: ' + error;
  }
});