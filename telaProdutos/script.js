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
import { db } from '../APIs/autenticacao.js'; // exporta db no autenticacao.js
import { doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const URL_API = 'https://site-cha-e-encantos-production.up.railway.app/produtos'

let produtos = [];


async function carregarProdutos() {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = 'Carregando...';


    try {
        const response = await fetch(URL_API);
        produtos = await response.json();

        gerarCategorias(produtos);
        renderizarProdutos(produtos);

    } catch (err) {
        console.error('Erro ao carregar produtos', err);
        container.innerHTML = 'Erro ao carregar produtos.';
    }
}

function getCategorias(produto) {
  if (Array.isArray(produto.categoria)) return produto.categoria;
    return String(produto.categoria).split(/[,|]/).map(c => c.trim());
}


function pegarCategoriaenviada() {
    const categoria_temp = new URLSearchParams(window.location.search);
    return categoria_temp.get('categoria') || 'todos';
}


function gerarCategorias(lista) {
    const div_categoria = document.getElementById('categoria');
    div_categoria.innerHTML = '<button class="botao" onclick="filtrarCategoria(\'todos\')">Todos</button>';

    let categoriasSeparadas = new Set();

    lista.forEach(p => {
        // Cria uma função utilitária para extrair categorias do produto (evita repetir regex parsing)
        const getCategorias = (produto) => {
            if (Array.isArray(produto.categoria)) return produto.categoria;
            return String(produto.categoria).split(/[,|]/).map(c => c.trim());
        }
        getCategorias(p).forEach(cat => categoriasSeparadas.add(cat));
    })

    const categorias = [...categoriasSeparadas];

    categorias.forEach(cat => {
        const button = document.createElement('button');
        button.textContent = cat;
        button.classList.add('botao');
        button.onclick = () => filtrarCategoria(cat);
        div_categoria.appendChild(button);
    })
}


function renderizarProdutos(lista) {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';

    lista.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'produto';
        div.innerHTML = `
            <img src="${produto.imagemCaminho}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>${produto.descricao}</p>
            <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
            <button class="botao-adicionar" onclick="adicionarCarrinho(\'${produto.id}\', \'${produto.nome}\', ${produto.preco})">Adicionar ao carrinho</button>
        `;
        container.appendChild(div);
    });
}


function renderizarKits(lista) {
    const container = document.getElementById('lista-kits');
    container.innerHTML = "";

    lista.forEach(kit => {
        const kitDiv = document.createElement('div');
        kitDiv.classList.add('produto');

        kitDiv.innerHTML = `
            <img src="${kit.descricao}" alt="${kit.nome}">
            <h3>${kit.nome}</h3>
            <div class="preco">R$ ${kit.valor.toFixed(2)}</div>
            <div class="parcelado">ou 3x de R$ ${(kit.valor / 3).toFixed(2)}</div>
            <button class="botao-adicionar onclick="adicionarCarrinho(\'${kit.id}\', \'${kit.nome}\', ${kit.valor})">Adicionar ao carrinnho</button>
        `;

        container.appendChild(kitDiv);
    });
}


function filtrarCategoria(categoria) {
    if(categoria === 'todos') {
        renderizarProdutos(produtos);
    }else{
        const filtrados = produtos.filter(p => {
            
            return getCategorias(p).includes(categoria);
            
        });
        renderizarProdutos(filtrados);
    }
    
}

window.filtrarCategoria = filtrarCategoria;



async function filtrarPorBusca(termo) {
    const termoLower = termo.toLowerCase();
    const filtrados = produtos.filter(p => 
        p.nome.toLowerCase().includes(termoLower) ||
        p.descricao.toLowerCase().includes(termoLower)
    );
    renderizarProdutos(filtrados);
}


async function adicionarCarrinhoFirestore(id, nome, preco) {
    const user = await checaLogin();
    if (!user) {
        alert('Faça login para adicionar ao carrinho.');
        return;
    }

    const itemRef = doc(db, "usuarios", user.uid, "carrinho", id);
    const userRef = doc(db, "usuarios", user.uid)

    try {
        const itemSnap = await getDoc(itemRef);
        const userSnap = await getDoc(userRef)


        if(!userSnap.exists() || userSnap.data().totalCarrinho === undefined){
            await setDoc(userRef, { totalCarrinho: 0}, { merge: true});
        }

        if (itemSnap.exists()) {
            // Se já existe, incrementa quantidade e subtotal
            await updateDoc(itemRef, {
                quantidade: increment(1),
                subtotal: increment(preco)
            });
        } else {
            // Se não existe, cria o item
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
    

        alert('Item adicionado ao carrinho!');
    } catch (erro) {
        console.error('Erro ao adicionar no carrinho:', erro);
        alert('Erro ao adicionar no carrinho.');
    }
}

window.adicionarCarrinho = adicionarCarrinhoFirestore;


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
    const botaoKits = document.getElementById('verKits');

    try {
    const response = await fetch('https://site-cha-e-encantos-production.up.railway.app/kits');
        const kits = await response.json();
        renderizarKits(kits);
    } catch (error) {
        console.error('Erro ao carregar kits:', error);
    }


    carregarProdutos().then(() => {
        const params = new URLSearchParams(window.location.search);
        const categoria = params.get('categoria') || 'todos';
        const termoBusca = params.get('busca');
        const kit = params.get('kits');;

        if (termoBusca) {
            filtrarPorBusca(termoBusca);
        } else if(kit){
            document.getElementById('lista-kits').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        }else{
            filtrarCategoria(categoria);
        }
    })
    
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
    


      botaoKits.addEventListener('click', async () => {
        document.getElementById('lista-kits').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
      })



    
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

    const ajuda = document.getElementById('ajuda');
        ajuda.addEventListener('click', () => {
        window.location.href = '../telaDuvidas/index.html';
    });


    const carrinho = document.getElementById('carrinho')
    carrinho.addEventListener('click', () => {
        window.location.href = '../telaCarrinho/carrinho.html';
    })
    
})

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("formBusca");
  const input = document.getElementById("searchInput");

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const termo = input.value.trim();
      if (termo !== "") {
        const url = new URL(window.location.href);
        url.searchParams.set("busca", termo);
        window.location.href = url.toString(); // recarrega com nova busca
      }
    });
  }
});

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