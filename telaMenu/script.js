import { login, logout } from '../APIs/autenticacao.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from '../APIs/autenticacao.js'; // exporta db no autenticacao.js


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





function ajusteCarrossel() {
  const carrossel = document.querySelector('.carrossel');
  const btnEsquerda = document.querySelector('.seta.esquerda');
  const btnDireita = document.querySelector('.seta.direita');

  btnEsquerda.addEventListener('click', () => {
    carrossel.scrollBy({ left: -300, behavior: 'smooth' });
  });

  btnDireita.addEventListener('click', () => {
    carrossel.scrollBy({ left: 300, behavior: 'smooth' });
  });


  let isDown = false;
  let startX;
  let scrollLeft;

  carrossel.addEventListener('mousedown', (e) => {
    isDown = true;
    carrossel.classList.add('active');
    startX = e.pageX - carrossel.offsetLeft;
    scrollLeft = carrossel.scrollLeft;
  });

  carrossel.addEventListener('mouseleave', () => {
    isDown = false;
    carrossel.classList.remove('active');
  });

  carrossel.addEventListener('mouseup', () => {
    isDown = false;
    carrossel.classList.remove('active');
  });

  carrossel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carrossel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carrossel.scrollLeft = scrollLeft - walk;
  });

  carrossel.addEventListener('wheel', (e) => {
  e.preventDefault();
  carrossel.scrollLeft += e.deltaY;
  }, { passive: false});

  function ajustarCentralizacao() {
    const carrossel = document.querySelector('.carrossel');
    if (carrossel.scrollWidth <= carrossel.clientWidth) {
      carrossel.style.justifyContent = 'center';
    } else {
      carrossel.style.justifyContent = 'flex-start';
    }
  }

  ajustarCentralizacao();

  window.addEventListener('resize', ajustarCentralizacao);

}





document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://site-cha-e-encantos-production.up.railway.app/produtos');
        const produtos = await response.json();
        const destaques = produtos.filter(p => p.destaque);
        renderizarProdutos(destaques);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
});

function renderizarProdutos(lista) {
    const container = document.getElementById('carrossel');
    container.innerHTML = ""
    
    lista.forEach(produto => {
        const produtoDiv = document.createElement('div');
        produtoDiv.classList.add('produto');

        produtoDiv.innerHTML = `
            <img src="${produto.imagemCaminho}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
            <div class="parcelado">ou 3x de R$ ${(produto.preco / 3).toFixed(2)}</div>
        `;

        container.appendChild(produtoDiv);
    });

    ajusteCarrossel();
}



function faltamInfos(data) {
  if (!data) return true; // dados inexistentes, falta tudo

  // Defina os campos obrigatórios aqui
  const camposObrigatorios = ['nome', 'telefone', 'enderecos', 'cpf'];

  // Retorna true se algum campo obrigatório estiver vazio ou undefined
  return camposObrigatorios.some(campo => !data[campo] || data[campo].trim() === '');
}


document.addEventListener('DOMContentLoaded', () => {
  const conta = document.getElementById('minha-conta');

  conta.addEventListener('click', async () => {
    try {
      const usuario = await login();
      console.log('Logado como:', usuario.displayName);

      const userDocRef = doc(db, "usuarios", usuario.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists() || faltamInfos(userDocSnap.data())) {
        // Se não existe ou tem dados faltando, manda para o formulário
        window.location.href = '../telaCadastro/Cadastro.html';
      } else {
        window.location.href = './Menu.html';
      } 
    } catch (erro) {
      console.error('Erro no login:', erro);
      alert('Falha no login');
    }
  });
});
