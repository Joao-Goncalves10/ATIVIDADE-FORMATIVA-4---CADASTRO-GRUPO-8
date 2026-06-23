document.addEventListener("DOMContentLoaded", function () {
  renderizarCardapio();
  inicializarVitrine();
  inicializarHoverCards();
});

async function renderizarCardapio() {
  var grid = document.querySelector("#grid-cardapio");
  if (!grid) return;

  grid.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    var produtos = await buscarProdutos();

    if (produtos && produtos.dados) produtos = produtos.dados;

    grid.innerHTML = "";

    if (!Array.isArray(produtos)) throw new Error("Formato inesperado: produtos não é um array");

    produtos.forEach(function (produto) {
      var card = document.createElement("article");
      card.classList.add("card");
      card.setAttribute("data-id", produto.produto_id);

      var imagemUrl = produto.imagem || produto.foto || "https://via.placeholder.com/400x300?text=Sem+imagem";

      card.innerHTML =
        "<img src='" +
        imagemUrl +
        "' alt='" +
        produto.nome +
        "'>" +
        "<h3>" +
        produto.nome +
        "</h3>" +
        "<p class='desc'>" +
        produto.descricao +
        "</p>" +
        "<div class='quantidade-box'>" +
        "<button class='btn-qtd btn-menos'>-</button>" +
        "<span class='qtd-valor'>1</span>" +
        "<button class='btn-qtd btn-mais'>+</button>" +
        "</div>" +
        "<span class='preco' data-preco='" +
        produto.preco +
        "'>" +
        "R$ " +
        parseFloat(produto.preco).toFixed(2).replace(".", ",") +
        "</span>" +
        "<button class='btn-pedido'>Pedir Agora</button>";

      grid.appendChild(card);
    });
  } catch (erro) {
    console.error("Erro ao carregar cardápio:", erro);
    grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio. Veja o console para detalhes.</p>";
  }
}

function inicializarHoverCards() {
  var cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "none";
    });
  });
}

function inicializarVitrine() {
  var main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    var clicado = event.target;

    if (clicado.classList.contains("btn-menos")) {
      var box = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    if (clicado.classList.contains("btn-mais")) {
      var box = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();

      var card = clicado.parentElement;

      var produtoId = Number(card.getAttribute("data-id"));
      var quantidade = Number(card.querySelector(".qtd-valor").textContent);

      clicado.disabled = true;
      clicado.textContent = "Enviando...";

      salvarPedido(produtoId, quantidade, clicado);
    }
  });
}

function atualizarPrecoCard(box) {
  var card = box.parentElement;
  var spanPreco = card.querySelector(".preco");
  var precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  var quantidade = Number(box.querySelector(".qtd-valor").textContent);
  var total = precoUnitario * quantidade;

  spanPreco.textContent = "R$ " + total.toFixed(2).replace(".", ",");
  if (total > 150) {
    spanPreco.classList.add("preco-alto");
  } else {
    spanPreco.classList.remove("preco-alto");
  }
}

async function salvarPedido(produtoId, quantidade, botao) {
  var cliente = sessionStorage.getItem("techfood_cliente") || "Cliente";

  try {
    await criarPedido(cliente, [
      { produto_id: produtoId, quantidade: quantidade },
    ]);

    // Feedback de sucesso
    botao.textContent = "✓ Pedido enviado!";
    botao.style.backgroundColor = "#27ae60";

    atualizarContadorPedidos();

    setTimeout(function () {
      botao.textContent = "Pedir Agora";
      botao.style.backgroundColor = "";
      botao.disabled = false;

      // Reset de quantidade após o feedback
      var box = botao.parentElement.querySelector(".quantidade-box");
      if (box) {
        box.querySelector(".qtd-valor").textContent = "1";
        atualizarPrecoCard(box);
      }
    }, 2000);
  } catch (erro) {
    // Feedback de erro — libera o botão para tentar de novo
    botao.textContent = "Erro! Tente novamente";
    botao.style.backgroundColor = "#e74c3c";
    botao.disabled = false;

    setTimeout(function () {
      botao.textContent = "Pedir Agora";
      botao.style.backgroundColor = "";
    }, 2500);
  }
}

async function atualizarContadorPedidos() {
  try {
    var resposta = await buscarPedidos();
    var pedidos = resposta && resposta.dados ? resposta.dados : resposta;
    if (!Array.isArray(pedidos)) pedidos = [];
    var total = pedidos.reduce(function (acc, p) {
      if (p && Array.isArray(p.itens))
        return (
          acc +
          p.itens.reduce(function (a, i) {
            return a + Number(i.quantidade || 0);
          }, 0)
        );
      return acc + 1;
    }, 0);

    var linkMenu = document.querySelector("#menu a[href='pedidos.html']");
    if (!linkMenu) return;

    var badge = linkMenu.querySelector(".badge-menu");
    if (!badge) {
      linkMenu.insertAdjacentHTML(
        "beforeend",
        "<span class='badge-menu'>0</span>",
      );
      badge = linkMenu.querySelector(".badge-menu");
    }

    badge.textContent = total;
    linkMenu.classList.add("menu-ativo");
  } catch (erro) {
    console.warn("Não foi possível atualizar o contador de pedidos.");
  }
}