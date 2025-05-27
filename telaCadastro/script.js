const token = localStorage.getItem('token');


if(token){
    fetch('')
}



const cpfInput = document.getElementById("cpf");


cpfInput.addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");

  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  this.value = value;
});



const telInput = document.getElementById("telefone");

telInput.addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);

  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d{1,4})$/, "$1-$2");

  this.value = value;
});



const form = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value,
    enderecos: document.getElementById("endereco").value,
    cpf: document.getElementById("cpf").value,
    telefone: document.getElementById("telefone").value,
  };

  const uid = localStorage.getItem('uid');

  try {
    const response = await fetch(
      `https://site-cha-e-encantos-production.up.railway.app/usuarios/${uid}`,
      {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
         },
        body: JSON.stringify(dados),
      }
    );

    const data = await response.json();

    if (response.ok) {
      mensagem.innerText = "Dados atualizados com sucesso! ID: " + data.id;
      form.reset();
      window.location.href = '../telaMenu/Menu.html'
    } else {
      mensagem.innerText = "Erro: " + data.error;
    }
  } catch (error) {
    mensagem.innerText = "Erro na requisição: " + error;
  }
});