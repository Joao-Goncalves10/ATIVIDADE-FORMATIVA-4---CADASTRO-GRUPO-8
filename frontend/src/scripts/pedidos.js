document.addEventListener("DOMContentLoaded", function () {
  renderizarPedidos();
  setInterval(renderizarPedidos, 30000);
});

async function renderizarPedidos() {
  var lista = document.querySelector("#lista-pedidos");
  var spanTotal = document.querySelector("#valor-total");
  var spanResumoItens = document.querySelector("#contador-itens");
  var spanResumoTotal = document.querySelector("#valor-total-resumo");
  if (!lista) return;

  try {
    var resposta = await buscarPedidos();
    var pedidos = resposta && resposta.dados ? resposta.dados : resposta;
    if (!Array.isArray(pedidos)) pedidos = [];

    if (pedidos.length === 0) {
      lista.innerHTML = "<li class='pedido-vazio'>Nenhum pedido ainda. 😊</li>";
      if (spanTotal) spanTotal.textContent = "R$ 0,00";
      if (spanResumoItens) spanResumoItens.textContent = "0 itens";
      if (spanResumoTotal) spanResumoTotal.textContent = "R$ 0,00";
      return;
    }

    lista.innerHTML = "";
    var totalGeral = 0;
    var totalItens = 0;

    pedidos.forEach(function (pedido) {
      var statusPedido = pedido && pedido.status ? pedido.status : "pendente";
      var totalPedido = parseFloat(pedido && pedido.total ? pedido.total : 0) || 0;

      var li = document.createElement("li");
      li.classList.add("item-pedido", "status-" + statusPedido);

      li.innerHTML =
        "<div class='pedido-info'>" +
        "<strong>#" +
        (pedido.id || "-") +
        " — " +
        ((pedido && pedido.cliente) || "Cliente") +
        "</strong>" +
        "<span class='pedido-total'>R$ " +
        totalPedido.toFixed(2).replace(".", ",") +
        "</span>" +
        "</div>" +
        "<div class='pedido-status'>" +
        "<span class='badge-status badge-" +
        statusPedido +
        "'>" +
        statusPedido.toUpperCase() +
        "</span>" +
        gerarBotaoStatus(pedido.id, statusPedido) +
        "<button class='btn-excluir-pedido' onclick='confirmarExclusao(" +
        pedido.id +
        ")'>Excluir</button>" +
        "</div>";

      lista.appendChild(li);
      totalGeral += totalPedido;
      if (pedido && Array.isArray(pedido.itens)) {
        totalItens += pedido.itens.reduce(function (acc, item) {
          return acc + Number(item.quantidade || 0);
        }, 0);
      }
    });

    if (spanTotal) {
      spanTotal.textContent = "R$ " + totalGeral.toFixed(2).replace(".", ",");
    }
    if (spanResumoItens) {
      spanResumoItens.textContent = totalItens + " itens";
    }
    if (spanResumoTotal) {
      spanResumoTotal.textContent = "R$ " + totalGeral.toFixed(2).replace(".", ",");
    }
  } catch (erro) {
    lista.innerHTML =
      "<li class='pedido-vazio erro'>Erro ao carregar pedidos.</li>";
    if (spanResumoItens) spanResumoItens.textContent = "0 itens";
    if (spanResumoTotal) spanResumoTotal.textContent = "R$ 0,00";
  }
}

function gerarBotaoStatus(pedidoId, statusAtual) {
  var proximo = {
    pendente: { label: "▶ Iniciar preparo", status: "preparo" },
    preparo: { label: "✓ Marcar como pronto", status: "pronto" },
    pronto: { label: "🛵 Marcar entregue", status: "entregue" },
    entregue: null,
  };

  var acao = proximo[statusAtual];
  if (!acao) return "<span class='entregue-label'>✓ Concluído</span>";

  return (
    "<button class='btn-status' onclick='avancarStatus(" +
    pedidoId +
    ', "' +
    acao.status +
    "\")'>" +
    acao.label +
    "</button>"
  );
}

async function avancarStatus(pedidoId, novoStatus) {
  try {
    await atualizarStatusPedido(pedidoId, novoStatus);
    renderizarPedidos();
  } catch (erro) {
    alert("Erro ao atualizar status: " + erro.message);
  }
}

function confirmarExclusao(pedidoId) {
  var confirmado = window.confirm("Deseja realmente excluir este pedido?");
  if (!confirmado) return;
  excluirPedido(pedidoId)
    .then(function () {
      renderizarPedidos();
    })
    .catch(function (erro) {
      alert("Erro ao excluir pedido: " + erro.message);
    });
}
