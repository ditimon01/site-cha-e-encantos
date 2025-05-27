document.getElementById("formAtendimento").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const contato = document.getElementById("contato").value.trim();
  const preferencia = document.getElementById("preferencia").value;
  const mensagem = document.getElementById("mensagem").value.trim();

  if (!nome || !contato || !preferencia || !mensagem) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  alert("Sua solicitação de atendimento foi enviada com sucesso! Entraremos em contato em breve.");
  this.reset();
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
      window.location.href = '../telaCarrinho/index.html';
    });

    voltar.addEventListener('click', () => {
      window.location.href = '../telaMenu/Menu.html';
    });
});
