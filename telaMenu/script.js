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




function ajusteCarrossel(carrossel_temp) {
  const carrossel = document.querySelector(carrossel_temp);
  const btnEsquerda = document.querySelector('.seta.esquerda');
  const btnDireita = document.querySelector('.seta.direita');

  if(!carrossel) return;

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
    if (carrossel.scrollWidth <= carrossel.clientWidth) {
      carrossel.style.justifyContent = 'center';
    } else {
      carrossel.style.justifyContent = 'flex-start';
    }
  }

  ajustarCentralizacao();

  window.addEventListener('resize', ajustarCentralizacao);

}



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

  ajusteCarrossel('#carrossel');
}


function renderizarKits(lista){
  const container = document.getElementById('carrossel-2');
  container.innerHTML = ""
  
  lista.forEach(kit => {
      const kitDiv = document.createElement('div');
      kitDiv.classList.add('produto');

      kitDiv.innerHTML = `
          
          <div class="preco">R$ ${kit.preco.toFixed(2)}</div>
          <div class="parcelado">ou 3x de R$ ${(kit.preco / 3).toFixed(2)}</div>
      `;

      container.appendChild(kitDiv);
  });

  ajusteCarrossel('#carrossel-2');
}



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

 /*produtos*/
  try {
    const response = await fetch('https://site-cha-e-encantos-production.up.railway.app/produtos');
    const produtos = await response.json();
    const destaques = produtos.filter(p => p.destaque);
    renderizarProdutos(destaques);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }

  /*kits*/
  try {
  const response = await fetch('https://site-cha-e-encantos-production.up.railway.app/kits');
    const kits = await response.json();
    renderizarKits(kits);
  } catch (error) {
    console.error('Erro ao carregar kits:', error);
  }

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


const ajuda = document.getElementById('ajuda');
ajuda.addEventListener('click', () => {
  window.location.href = '../telaDuvidas/index.html';
});