document.querySelectorAll('.btn-comentar').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const textarea = document.querySelectorAll('.comentario')[index];
    const comentario = textarea.value.trim();

    if (comentario !== "") {
      const lista = document.querySelectorAll('.lista-comentarios')[index];
      const novoItem = document.createElement('li');
      novoItem.textContent = comentario;
      lista.appendChild(novoItem);
      textarea.value = "";
    }
  });
});
