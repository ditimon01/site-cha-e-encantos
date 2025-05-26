document.getElementById("formAjuda").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  if (!nome || !telefone || !mensagem) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  alert("Sua mensagem foi enviada com sucesso!\nEntraremos em contato em breve.");
  this.reset();
});
