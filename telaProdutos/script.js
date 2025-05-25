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




const URL_API = 'https://site-cha-e-encantos-production.up.railway.app/produtos'

let produtos = [];
let carrinho = [];


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


function pegarCategoriaenviada() {
    const categoria_temp = new URLSearchParams(window.location.search);
    return categoria_temp.get('categoria') || 'todos';
}




function gerarCategorias(lista) {
    const div_categoria = document.getElementById('categoria');
    div_categoria.innerHTML = '<button class="botao" onclick="filtrarCategoria(\'todos\')">Todos</button>';

    const categoriasSeparadas = new Set();

    lista.forEach(p => {
        const categoriasProduto = Array.isArray(p.categoria) ? p.categoria : String(p.categoria).split(/[,|]/).map(c => c.trim());
        categoriasProduto.forEach(cat => categoriasSeparadas.add(cat));
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


function filtrarCategoria(categoria) {
    if(categoria === 'todos') {
        renderizarProdutos(produtos);
    }else{
        const filtrados = produtos.filter(p => {
            const categorias = Array.isArray(p.categoria) ? p.categoria : String(p.categoria).split(/[,|]/).map(c => c.trim());
            return categorias.includes(categoria);
            
        });
        renderizarProdutos(filtrados);
    }
}


function adicionarCarrinho(id, nome, preco) {
    carrinho.push({ id, nome, preco });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('itens-carrinho');
    const totalSpan = document.getElementById('total');
    lista.innerHTML = '';

    let total = 0;
    carrinho.forEach(item => {
        total += item.preco;
        const li = document.createElement('li');
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        lista.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2);
}



document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos().then(() => {
        const categoria = pegarCategoriaenviada();
        filtrarCategoria(categoria);
    })

})