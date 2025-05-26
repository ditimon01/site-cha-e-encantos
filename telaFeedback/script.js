document.getElementById('formFeedback').addEventListener('submit', function(e) {
  e.preventDefault();

  // Simula envio
  this.style.display = 'none';
  document.getElementById('mensagem-sucesso').style.display = 'block';
});
