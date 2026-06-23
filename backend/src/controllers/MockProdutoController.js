const produtosMock = [
  {
    id: 1,
    produto_id: 1,
    nome: 'Lasanha Tradicional',
    descricao: 'Molho especial, queijo e carne moída.',
    preco: 28.5,
    categoria: 'Massa',
    disponivel: true,
    imagem: 'https://via.placeholder.com/600x400?text=Lasanha'
  }
];

let nextId = 2;

class MockProdutoController {
  async listar(req, res) {
    try {
      // Return array in the same shape the frontend expects
      const dados = produtosMock.map(p => ({
        ...p,
        produto_id: p.id,
        foto: p.imagem
      }));
      res.json(dados);
    } catch (err) {
      res.status(500).json({ sucesso: false, mensagem: 'Erro interno (mock)', erro: err });
    }
  }

  async buscarPorId(req, res) {
    const id = Number(req.params.id);
    const prod = produtosMock.find(p => p.id === id);
    if (!prod) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado (mock)' });
    res.json({ sucesso: true, dados: prod });
  }

  async cadastrar(req, res) {
    try {
      const { nome, descricao, preco, categoria, disponivel } = req.body || {};
      const precoConv = typeof preco === 'string' ? parseFloat(preco.replace(',', '.')) : preco;

      if (!nome || !descricao || !precoConv || isNaN(precoConv) || precoConv <= 0) {
        return res.status(400).json({ sucesso: false, mensagem: 'Dados inválidos (mock)' });
      }

      const novo = {
        id: nextId,
        produto_id: nextId,
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: precoConv,
        categoria: categoria || null,
        disponivel: disponivel === 'false' || disponivel === false ? false : true,
        imagem: req.file ? null : 'https://via.placeholder.com/600x400?text=Novo+Prato'
      };

      produtosMock.unshift(novo);
      nextId++;

      res.status(201).json({ sucesso: true, mensagem: 'Produto cadastrado (mock)', id: novo.id });
    } catch (err) {
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar (mock)', erro: err });
    }
  }

  async atualizar(req, res) {
    const id = Number(req.params.id);
    const prod = produtosMock.find(p => p.id === id);
    if (!prod) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado (mock)' });
    const { nome, descricao, preco, categoria, disponivel } = req.body || {};
    if (nome !== undefined) prod.nome = nome.trim();
    if (descricao !== undefined) prod.descricao = descricao.trim();
    if (preco !== undefined) prod.preco = typeof preco === 'string' ? parseFloat(preco.replace(',', '.')) : preco;
    if (categoria !== undefined) prod.categoria = categoria;
    if (disponivel !== undefined) prod.disponivel = disponivel === 'false' || disponivel === false ? false : true;
    res.json({ sucesso: true, mensagem: 'Produto atualizado (mock)' });
  }

  async deletar(req, res) {
    const id = Number(req.params.id);
    const idx = produtosMock.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado (mock)' });
    produtosMock.splice(idx, 1);
    res.json({ sucesso: true, mensagem: 'Produto removido (mock)' });
  }
}

module.exports = new MockProdutoController();
