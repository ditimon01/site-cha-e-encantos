const API_URL = "http://localhost:3000"; // Ajuste se estiver em outro domínio
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", carregarCarrinho);

async function carregarCarrinho() {
  try {
    const resposta = await fetch(`${API_URL}/usuario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resposta.ok) {
      throw new Error("Falha ao buscar usuário.");
    }

    const usuario = await resposta.json();
    const carrinho = usuario.carrinho || [];

    exibirItensCarrinho(carrinho);
    atualizarResumo(carrinho);
  } catch (error) {
    console.error("Erro ao carregar carrinho:", error);
    alert("Erro ao carregar carrinho.");
  }
}

function exibirItensCarrinho(carrinho) {
  const container = document.querySelector(".cart-items");
  container.innerHTML = ""; // Limpa

  if (carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio.</p>";
    return;
  }

  carrinho.forEach((produto) => {
    const item = document.createElement("div");
    item.classList.add("cart-item");
    item.innerHTML = `
      <div class="item-info">
        <h3>${produto.nome}</h3>
        <p>Preço: R$ ${produto.preco.toFixed(2)} | Quantidade: ${
      produto.quantidade
    }</p>
      </div>
    `;
    container.appendChild(item);
  });
}

function atualizarResumo(carrinho) {
  const subtotal = carrinho.reduce(
    (acc, produto) => acc + produto.preco * produto.quantidade,
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