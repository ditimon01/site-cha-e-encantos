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
