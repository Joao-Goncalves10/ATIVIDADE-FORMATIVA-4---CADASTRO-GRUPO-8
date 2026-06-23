document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('form-cadastro');
  const mensagemElement = document.getElementById('mensagem-cadastro');
  const fotoInput = document.getElementById('foto-prato');
  const previewContainer = document.getElementById('preview-container');

  function exibirMensagem(texto, tipo) {
    mensagemElement.textContent = texto;
    mensagemElement.className = 'mensagem-resultado ' + tipo;
  }

  function limparMensagem() {
    mensagemElement.textContent = '';
    mensagemElement.className = 'mensagem-resultado';
  }

  function atualizarPreview(file) {
    previewContainer.innerHTML = '';
    if (!file) return;

    const previewBox = document.createElement('div');
    previewBox.className = 'image-preview';

    const imagem = document.createElement('img');
    imagem.src = URL.createObjectURL(file);
    imagem.alt = 'Pré-visualização da imagem do prato';

    const legenda = document.createElement('span');
    legenda.textContent = file.name;

    previewBox.appendChild(imagem);
    previewBox.appendChild(legenda);
    previewContainer.appendChild(previewBox);
  }

  if (fotoInput) {
    fotoInput.addEventListener('change', () => {
      atualizarPreview(fotoInput.files[0]);
    });
  }

  if (!formCadastro) return;

  formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();
    limparMensagem();

    const nomeInput = document.getElementById('nome-prato');
    const descricaoInput = document.getElementById('descricao-prato');
    const precoInput = document.getElementById('preco-prato');
    const categoriaInput = document.getElementById('categoria-prato');
    const disponivelInput = document.getElementById('disponivel-prato');

    const nome = nomeInput.value.trim();
    const descricao = descricaoInput.value.trim();
    const precoTexto = precoInput.value.trim().replace(',', '.');
    const categoria = categoriaInput.value;
    const disponivel = disponivelInput.checked;

    if (!nome) {
      exibirMensagem('Por favor, insira um nome válido para o prato.', 'erro');
      nomeInput.focus();
      return;
    }

    if (!descricao) {
      exibirMensagem('Por favor, descreva o prato.', 'erro');
      descricaoInput.focus();
      return;
    }

    const preco = parseFloat(precoTexto);
    if (isNaN(preco) || preco <= 0) {
      exibirMensagem('Por favor, insira um preço maior que zero.', 'erro');
      precoInput.focus();
      return;
    }

    if (!categoria) {
      exibirMensagem('Por favor, escolha uma categoria.', 'erro');
      categoriaInput.focus();
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('preco', preco.toFixed(2));
    formData.append('categoria', categoria);
    formData.append('disponivel', disponivel ? 'true' : 'false');
    if (fotoInput.files.length > 0) {
      formData.append('foto', fotoInput.files[0]);
    }

    exibirMensagem('Enviando o prato para o servidor...', 'sucesso');

    try {
      const response = await fetch(`${BASE_URL}/produtos`, {
        method: 'POST',
        body: formData,
      });

      const resultado = await response.json();
      if (!response.ok) {
        throw new Error(resultado.mensagem || resultado.erro || 'Erro ao cadastrar o prato.');
      }

      exibirMensagem('Prato cadastrado com sucesso! 🎉 Voltando ao cardápio...', 'sucesso');
      formCadastro.reset();
      atualizarPreview(null);

      setTimeout(function () {
        window.location.href = 'index.html';
      }, 1500);
    } catch (erro) {
      console.error('Erro ao cadastrar prato:', erro);
      const mensagem = erro.message || 'Falha ao conectar ao servidor. Verifique se o backend está rodando.';
      exibirMensagem(mensagem, 'erro');
    }
  });
});