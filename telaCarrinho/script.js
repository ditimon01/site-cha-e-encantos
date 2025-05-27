
const API_URL = "https://site-cha-e-encantos-production.up.railway.app";


import { login, logout, checaLogin } from '../APIs/autenticacao.js';
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from '../APIs/autenticacao.js';


async function carregarCarrinho(id) {
   try {
    const container = document.querySelector(".cart-items");
    container.innerHTML = ""; // limpa antes de carregar

    const carrinhoRef = collection(db, "usuarios", id, "carrinho");
    const snapshot = await getDocs(carrinhoRef);

    const carrinho = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (carrinho.length === 0) {
      container.innerHTML = "<p>Seu carrinho está vazio.</p>";
      return;
    }

    carrinho.forEach((produto) => {
      const preco = produto.precoUnitario ?? 0;
      const quantidade = produto.quantidade ?? 0;

      const item = document.createElement("div");
      item.classList.add("cart-item");
      item.innerHTML = `
        <div class="item-info">
          <h3>${produto.nome || "Produto sem nome"}</h3>
          <p>Preço: R$ ${preco.toFixed(2)} | Quantidade: ${quantidade}</p>
        </div>
      `;
      container.appendChild(item);
    });

    atualizarResumo(carrinho);

  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
    alert("Erro ao carregar carrinho.");
  }
}


function atualizarResumo(carrinho) {
  const subtotal = carrinho.reduce(
    (acc, produto) => acc + (produto.precoUnitario ?? 0) * (produto.quantidade ?? 0),
    0
  );
  const frete = subtotal > 100 ? 0 : 15;
  const total = subtotal + frete;

  const resumoDiv = document.querySelector(".summary");
  const blocos = resumoDiv.querySelectorAll("div");

  // Subtotal
  blocos[0].querySelectorAll("span")[1].textContent = `R$ ${subtotal.toFixed(
    2
  )}`;

  // Frete
  blocos[1].querySelectorAll("span")[1].textContent = `R$ ${frete.toFixed(2)}`;

  // Total
  const totalSpans = blocos[2].querySelectorAll("span");
  totalSpans[0].textContent = "Total";
  totalSpans[1].textContent = `R$ ${total.toFixed(2)}`;
}


function faltamInfos(data) {
  if (!data) return true; // dados inexistentes, falta tudo

  const camposObrigatorios = ['nome', 'telefone', 'enderecos', 'cpf'];

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
          
          carregarCarrinho(usuario.uid);
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
    
})

document.addEventListener('DOMContentLoaded', () => {
  const ajuda = document.getElementById('ajuda');
  const conta = document.getElementById('minha-conta');
  const carrinho = document.getElementById('carrinho');
  const voltar = document.getElementById('volta-menu');

    ajuda.addEventListener('click', () => {
      window.location.href = '../telaAjuda/index.html';
    });

    conta.addEventListener('click', () => {
      window.location.href = '../telaConta/conta.html';
    });

    carrinho.addEventListener('click', () => {
      window.location.href = '../telaCarrinho/carrinho.html';
    });

    voltar.addEventListener('click', () => {
      window.location.href = '../telaMenu/Menu.html';
    });
});

