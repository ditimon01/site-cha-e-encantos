document.getElementById("formAssinatura").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const contato = document.getElementById("contato").value.trim();
  const endereco = document.getElementById("endereco").value.trim();
  const plano = document.getElementById("plano").value;
  const pagamento = document.getElementById("pagamento").value;
  const obs = document.getElementById("observacoes").value.trim();

  if (!nome || !contato || !endereco || !plano || !pagamento) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  alert(`Assinatura registrada com sucesso!\n\nPlano: ${plano}\nForma de pagamento: ${pagamento}\nEntraremos em contato para confirmar.`);
  this.reset();
});
