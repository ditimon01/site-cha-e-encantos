 const form = document.getElementById('formProduto');
    const mensagem = document.getElementById('mensagem');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const produto = {
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value),
        descricao: document.getElementById('descricao').value,
        estoque: parseInt(document.getElementById('estoque').value)
      };

      try {
        const response = await fetch('https://site-cha-e-encantos-production.up.railway.app/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto)
        });

        const data = await response.json();

        if (response.ok) {
          mensagem.innerText = 'Produto cadastrado com sucesso! ID: ' + data.id;
          form.reset();
        } else {
          mensagem.innerText = 'Erro: ' + data.error;
        }

      } catch (error) {
        mensagem.innerText = 'Erro na requisição: ' + error;
      }
    });