



  const firebaseConfig = {
    apiKey: "AIzaSyBSkzmG4PkefRFdvmDQopUlibyhonBI0t4",
    authDomain: "site-cha-e-encantos.firebaseapp.com",
    projectId: "site-cha-e-encantos",
    storageBucket: "site-cha-e-encantos.appspot.com",
    messagingSenderId: "983006416430",
    appId: "1:983006416430:web:8dbba5a8f82aacd19f59bf",
    measurementId: "G-2N72DMR5F8"
  };



// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
    if(user) {
        console.log('Usuário está logado: ', user.email);
    }
    else{
        alert('Você precisa estar logado para acessar essa página.');
        window.location.href = "../telaTestes/testeLogin.html";
    }
})


const form = document.getElementById('formProduto');

form.addEventListener('submit', async  (e) => {
  e.preventDefault();

  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Você precisa estar logado para cadastrar produtos!');
    return;
  }

  // Pega o idToken do usuário
  const idToken = await user.getIdToken();

  const nome = form.nome.value.trim();
  const descricao = form.descricao.value.trim();
  const preco = parseFloat(form.preco.value);
  const imagemCaminho = form.imagemCaminho.value.trim();

  let categorias = form.categoria.value.split(',').map(cat => cat.trim().toLowerCase()).filter(cat => cat.length > 0);

  if(document.getElementById("categoriaVovo").checked) {
    categorias.push('chá da vovó');
  }


  const estoque = parseInt(form.estoque.value);
  const ativo = form.ativo.checked;
  const destaque = form.destaque.checked;;;

  const produto = {
    nome,
    descricao,
    preco,
    imagemCaminho,
    categoria: categorias,
    estoque,
    ativo,
    destaque,
    criadoEm: new Date().toISOString()
  };

  try {
    const response = await fetch('https://site-cha-e-encantos-production.up.railway.app/produtos', {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
          },
          body: JSON.stringify(produto)
        });

        const json = await response.json();
        alert('Produto cadastrado com sucesso!');
        form.reset();
    } catch (error) {
        alert('Erro na requisição: ' + error.message);
    }

});