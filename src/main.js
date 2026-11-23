import "./style.css";

import {
  verificarAPI,
  carregarCategorias,
  cadastrarDoador,
  carregarDoadores,
  editarDoador,
  excluirDoador,
  cadastrarDoacao,
  carregarDoacoes,
} from "./api.js";

import {
  montarInterface,
  renderizarPagina,
  atualizarStatusAPI,
  atualizarIndicadores,
  exibirDoadores,
  prepararEdicaoDoador,
  cancelarEdicaoDoador,
  preencherSelecoesDoacao,
  definirDataAtualDoacao,
  exibirDoacoes,
} from "./ui.js";

// Dados guardados durante a utilização da aplicação
let doadoresAtuais = [];
let categoriasAtuais = [];
let doacoesAtuais = [];

// Identifica a página que está aberta
function obterRotaAtual() {
  return location.hash.replace("#", "") || "/inicio";
}

// Atualiza a lista de doadores
async function atualizarListaDoadores() {
  try {
    doadoresAtuais = await carregarDoadores();
    exibirDoadores(doadoresAtuais);
    preencherSelecoesDoacao(doadoresAtuais, categoriasAtuais);
    atualizarIndicadores(doadoresAtuais, doacoesAtuais, categoriasAtuais);
  } catch (erro) {
    const lista = document.querySelector("#lista-doadores");

    if (lista) {
      lista.innerHTML = `
        <tr>
          <td colspan="8">Não foi possível carregar os doadores.</td>
        </tr>
      `;
    }

    console.error("Erro ao carregar doadores:", erro);
  }
}

// Atualiza a lista de doações
async function atualizarListaDoacoes() {
  try {
    doacoesAtuais = await carregarDoacoes();
    exibirDoacoes(doacoesAtuais);
    atualizarIndicadores(doadoresAtuais, doacoesAtuais, categoriasAtuais);
  } catch (erro) {
    const lista = document.querySelector("#lista-doacoes");

    if (lista) {
      lista.innerHTML = `
        <tr>
          <td colspan="6">Não foi possível carregar as doações.</td>
        </tr>
      `;
    }

    console.error("Erro ao carregar doações:", erro);
  }
}

// Prepara os dados necessários para a página aberta
async function carregarDadosDaPagina() {
  const rota = obterRotaAtual();

  if (rota === "/doadores") {
    await atualizarListaDoadores();
  }

  if (rota === "/doacoes/nova") {
    await atualizarListaDoadores();
    preencherSelecoesDoacao(doadoresAtuais, categoriasAtuais);
    definirDataAtualDoacao();
  }

  if (rota === "/doacoes") {
    await atualizarListaDoacoes();
  }

  if (rota === "/inicio") {
    atualizarIndicadores(doadoresAtuais, doacoesAtuais, categoriasAtuais);
  }
}

// Navegação entre as páginas
function navegarParaPagina() {
  renderizarPagina(location.hash);

  carregarDadosDaPagina().catch((erro) => {
    console.error("Erro ao carregar os dados da página:", erro);
  });
}

// Monta a interface inicial
montarInterface();

// Carrega os dados iniciais da aplicação
async function iniciarAplicacao() {
  try {
    const dadosAPI = await verificarAPI();
    atualizarStatusAPI(dadosAPI);
  } catch (erro) {
    const status = document.querySelector("#api-status");

    if (status) {
      status.textContent = "Não foi possível conectar à API.";
    }

    console.error("Erro na conexão com a API:", erro);
  }

  try {
    categoriasAtuais = await carregarCategorias();
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }

  try {
    doadoresAtuais = await carregarDoadores();
  } catch (erro) {
    console.error("Erro ao carregar doadores:", erro);
  }

  try {
    doacoesAtuais = await carregarDoacoes();
  } catch (erro) {
    console.error("Erro ao carregar doações:", erro);
  }

  preencherSelecoesDoacao(doadoresAtuais, categoriasAtuais);
  atualizarIndicadores(doadoresAtuais, doacoesAtuais, categoriasAtuais);

  await carregarDadosDaPagina();
}

// Quando o utilizador muda de página pelo menu
window.addEventListener("hashchange", navegarParaPagina);

// Limpa as mensagens quando o utilizador altera os formulários
document.addEventListener("input", (evento) => {
  if (evento.target.closest("#form-doador")) {
    const status = document.querySelector("#doador-status");
    if (status) status.textContent = "";
  }

  if (evento.target.closest("#form-doacao")) {
    const status = document.querySelector("#doacao-status");
    if (status) status.textContent = "";
  }
});

document.addEventListener("change", (evento) => {
  if (evento.target.closest("#form-doador")) {
    const status = document.querySelector("#doador-status");
    if (status) status.textContent = "";
  }

  if (evento.target.closest("#form-doacao")) {
    const status = document.querySelector("#doacao-status");
    if (status) status.textContent = "";
  }
});

// Cadastra ou edita um doador
document.addEventListener("submit", async (evento) => {
  if (evento.target.id !== "form-doador") return;

  evento.preventDefault();

  const formulario = evento.target;
  const status = document.querySelector("#doador-status");
  const botao = document.querySelector("#botao-salvar-doador");

  const dados = Object.fromEntries(new FormData(formulario));
  const idEdicao = formulario.dataset.editandoId;

  try {
    botao.disabled = true;

    if (idEdicao) {
      status.textContent = "Salvando alterações...";

      const resultado = await editarDoador(idEdicao, dados);

      cancelarEdicaoDoador();
      status.textContent = resultado.mensagem;
    } else {
      status.textContent = "Cadastrando doador...";

      const resultado = await cadastrarDoador(dados);

      formulario.reset();
      status.textContent = resultado.mensagem;
    }

    await atualizarListaDoadores();
  } catch (erro) {
    status.textContent = erro.message;
    console.error("Erro ao salvar doador:", erro);
  } finally {
    botao.disabled = false;
  }
});

// Registra uma nova doação
document.addEventListener("submit", async (evento) => {
  if (evento.target.id !== "form-doacao") return;

  evento.preventDefault();

  const formulario = evento.target;
  const status = document.querySelector("#doacao-status");
  const botao = document.querySelector("#botao-salvar-doacao");

  const dados = Object.fromEntries(new FormData(formulario));

  dados.id_doador = Number(dados.id_doador);
  dados.id_categoria = Number(dados.id_categoria);
  dados.quantidade = Number(dados.quantidade);

  try {
    botao.disabled = true;
    status.textContent = "Registrando doação...";

    const resultado = await cadastrarDoacao(dados);

    formulario.reset();
    definirDataAtualDoacao();

    status.textContent = resultado.mensagem;

    // Atualiza os dados para que os indicadores também fiquem corretos
    doacoesAtuais = await carregarDoacoes();
    atualizarIndicadores(doadoresAtuais, doacoesAtuais, categoriasAtuais);
  } catch (erro) {
    status.textContent = erro.message;
    console.error("Erro ao registrar doação:", erro);
  } finally {
    botao.disabled = false;
  }
});

// Controla os botões Editar e Excluir da tabela de doadores
document.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("button[data-acao]");

  if (!botao) return;

  const tabela = botao.closest("#lista-doadores");
  if (!tabela) return;

  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;

  const status = document.querySelector("#doador-status");
  const doador = doadoresAtuais.find((item) => Number(item.id_doador) === id);

  if (!doador) {
    if (status) status.textContent = "Doador não encontrado na lista.";
    return;
  }

  if (acao === "editar") {
    prepararEdicaoDoador(doador);
    return;
  }

  if (acao === "excluir") {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o doador ${doador.nome}?`);

    if (!confirmar) return;

    try {
      botao.disabled = true;
      status.textContent = "Excluindo doador...";

      const resultado = await excluirDoador(id);

      const formulario = document.querySelector("#form-doador");

      if (formulario && Number(formulario.dataset.editandoId) === id) {
        cancelarEdicaoDoador();
      }

      status.textContent = resultado.mensagem;

      await atualizarListaDoadores();
    } catch (erro) {
      status.textContent = erro.message;
      console.error("Erro ao excluir doador:", erro);
    } finally {
      botao.disabled = false;
    }
  }
});

// Cancela a edição do doador
document.addEventListener("click", (evento) => {
  if (evento.target.id === "botao-cancelar-edicao") {
    cancelarEdicaoDoador();
  }
});

// Inicia a aplicação
iniciarAplicacao().catch((erro) => {
  console.error("Erro inesperado ao iniciar a aplicação:", erro);
});
