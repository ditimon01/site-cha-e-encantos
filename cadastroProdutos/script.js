function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;


import { login, logout, checaLogin } from '../APIs/autenticacao.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from '../APIs/autenticacao.js'; // exporta db no autenticacao.js

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSkzmG4PkefRFdvmDQopUlibyhonBI0t4",
    authDomain: "site-cha-e-encantos.firebaseapp.com",
    projectId: "site-cha-e-encantos",
    storageBucket: "site-cha-e-encantos.firebasestorage.app",
    messagingSenderId: "983006416430",
    appId: "1:983006416430:web:8dbba5a8f82aacd19f59bf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = '../telaMenu/Menu.html';
    return;
  }

  const email = user.email;
  const listaAdmins = ['fonsecavinicius12@gmail.com', 'alinediasmarquesramos638@gmail.com'];

  if (!listaAdmins.includes(email)) {
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


    categoria = categoria.filter(cat => cat !== "");
    if (!nome || categoria.length === 0 || isNaN(preco) || !descricao || isNaN(estoque) || !imagemCaminho) {
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


function faltamInfos(data) {
  if (!data) return true; // dados inexistentes, falta tudo

  // Defina os campos obrigatórios aqui
  const camposObrigatorios = ['nome', 'telefone', 'enderecos', 'cpf'];

  // Retorna true se algum campo obrigatório estiver vazio ou undefined
  return camposObrigatorios.some(campo => !data[campo] || data[campo].trim() === '');
}


document.addEventListener('DOMContentLoaded', async () => {
  const conta = document.getElementById('minha-conta');
  const contaTexto = conta.querySelector('span');
  const botaoSair = document.getElementById('logout');

  /*verifica login*/
  try {
    const usuario = await checaLogin();

    

    if (usuario) {
      const userDocRef = doc(db, "usuarios", usuario.uid);
      const userDocSnap = await getDoc(userDocRef);

      botaoSair.style.display = 'inline-block'


      if (userDocSnap.exists()) {
        const dados = userDocSnap.data();
        const nome = dados.nome?.split(' ')[0] || 'Conta';
        contaTexto.textContent = nome;
      }
    }
  } catch (erro) {
    console.error('Erro ao verificar usuário:', erro);
  }


  /*botão da conta*/
  conta.addEventListener('click', async () => {
    try {
      let user = await checaLogin();

      if (user) {
        const userDocRef = doc(db, "usuarios", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        botaoSair.style.display = 'inline-block'

        if (!userDocSnap.exists() || faltamInfos(userDocSnap.data())) {
          window.location.href = '../telaCadastro/Cadastro.html';
        } else {
          window.location.href = '../telaConta/conta.html';
        }
      } else {
        const usuario = await login();
        console.log('Logado como:', usuario.displayName);

        botaoSair.style.display = 'inline-block'

        const userDocRef = doc(db, "usuarios", usuario.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists() || faltamInfos(userDocSnap.data())) {
          window.location.href = '../telaCadastro/Cadastro.html';
        } else {
          window.location.reload();
        }
      }
    } catch (erro) {
      console.error('Erro no login:', erro);
      alert('Falha no login');
    }
  });


  /*botão de sair da conta*/
  botaoSair.addEventListener('click', async () => {
    try{
      await logout();
      botaoSair.style.display = 'none';
      contaTexto.textContent = 'Log In';
      window.location.reload();
    } catch (erro) {
      console.error('Erro ao fazer logout:', erro);
      alert('Erro ao sair da conta');
    }
  })

});
