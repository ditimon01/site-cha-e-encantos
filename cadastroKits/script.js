const API_URL = "https://site-cha-e-encantos-production.up.railway.app";
let produtos = [];
let produtosSelecionados = [];

window.onload = async () => {
    await verificarAdmin();
    await carregarProdutos();
};

async function verificarAdmin() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Acesso negado. Faça login.");
        window.location.href = "/login.html";
    }
    // Aqui poderia validar token no backend
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
                <input type="checkbox" value="${prod._id}" data-preco="${prod.preco}" onchange="atualizarTotal()"/>
            `;
            lista.appendChild(div);
        });
    } catch (error) {
        alert("Erro ao carregar produtos");
    }
}

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

    const totalComDesconto = total * 0.7;
    document.getElementById("valor-total").innerText = totalComDesconto.toFixed(2);
}

document.getElementById("kit-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const total = parseFloat(document.getElementById("valor-total").innerText);

    if (produtosSelecionados.length === 0) {
        alert("Selecione pelo menos um produto.");
        return;
    }

    const kit = {
        nome,
        descricao,
        produtos: produtosSelecionados,
        valor: total
    };

    try {
        const res = await fetch(`${API_URL}/kits`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            },
            body: JSON.stringify(kit)
        });

        if (res.ok) {
            alert("Kit cadastrado com sucesso!");
            window.location.reload();
        } else {
            const err = await res.json();
            alert("Erro: " + err.error);
        }
    } catch (error) {
        alert("Erro ao cadastrar kit.");
    }
});

function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login.html";
}

