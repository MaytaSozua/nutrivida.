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
  atualizarStatusAPI,
  exibirCategorias,
  exibirDoadores,
  prepararEdicaoDoador,
  cancelarEdicaoDoador,
  preencherSelecoesDoacao,
  definirDataAtualDoacao,
  exibirDoacoes,
} from "./ui.js";

// Monta a interface
montarInterface();

// Guarda os dados carregados
let doadoresAtuais = [];
let categoriasAtuais = [];

// Carrega os dados da aplicação
async function iniciarAplicacao() {
  try {
    const dados = await verificarAPI();
    atualizarStatusAPI(dados);
  } catch (erro) {
    document.querySelector("#api-status").textContent = "Não foi possível conectar à API.";

    console.error("Erro na conexão com a API:", erro);
  }

  try {
    categoriasAtuais = await carregarCategorias();
    exibirCategorias(categoriasAtuais);
  } catch (erro) {
    document.querySelector("#categorias-status").textContent =
      "Não foi possível carregar as categorias.";

    console.error("Erro ao carregar categorias:", erro);
  }

  await atualizarListaDoadores();

  preencherSelecoesDoacao(doadoresAtuais, categoriasAtuais);
  definirDataAtualDoacao();

  await atualizarListaDoacoes();
}

// Atualiza a lista de doadores
async function atualizarListaDoadores() {
  const lista = document.querySelector("#lista-doadores");

  try {
    doadoresAtuais = await carregarDoadores();

    exibirDoadores(doadoresAtuais);

    preencherSelecoesDoacao(doadoresAtuais, categoriasAtuais);
  } catch (erro) {
    lista.innerHTML = `
      <tr>
        <td colspan="8">
          Não foi possível carregar os doadores.
        </td>
      </tr>
    `;

    console.error("Erro ao carregar doadores:", erro);
  }
}

// Atualiza a lista de doações
async function atualizarListaDoacoes() {
  const lista = document.querySelector("#lista-doacoes");

  try {
    const doacoes = await carregarDoacoes();
    exibirDoacoes(doacoes);
  } catch (erro) {
    lista.innerHTML = `
      <tr>
        <td colspan="6">
          Não foi possível carregar as doações.
        </td>
      </tr>
    `;

    console.error("Erro ao carregar doações:", erro);
  }
}

// Limpa a mensagem do doador quando o utilizador altera o formulário
const formularioDoador = document.querySelector("#form-doador");
const statusDoador = document.querySelector("#doador-status");

formularioDoador.addEventListener("input", () => {
  statusDoador.textContent = "";
});

formularioDoador.addEventListener("change", () => {
  statusDoador.textContent = "";
});

// Limpa a mensagem da doação quando o utilizador altera o formulário
const formularioDoacao = document.querySelector("#form-doacao");
const statusDoacao = document.querySelector("#doacao-status");

formularioDoacao.addEventListener("input", () => {
  statusDoacao.textContent = "";
});

formularioDoacao.addEventListener("change", () => {
  statusDoacao.textContent = "";
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

      // Sai do modo de edição antes de apresentar a mensagem
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

    await atualizarListaDoacoes();
  } catch (erro) {
    status.textContent = erro.message;

    console.error("Erro ao registrar doação:", erro);
  } finally {
    botao.disabled = false;
  }
});

// Controla os botões da tabela de doadores
document.querySelector("#lista-doadores").addEventListener("click", async (evento) => {
  const botao = evento.target.closest("button[data-acao]");

  if (!botao) return;

  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;

  const status = document.querySelector("#doador-status");

  const doador = doadoresAtuais.find((item) => Number(item.id_doador) === id);

  if (!doador) {
    status.textContent = "Doador não encontrado na lista.";
    return;
  }

  // Prepara a edição
  if (acao === "editar") {
    prepararEdicaoDoador(doador);
    return;
  }

  // Exclui o doador
  if (acao === "excluir") {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o doador ${doador.nome}?`);

    if (!confirmar) return;

    try {
      botao.disabled = true;
      status.textContent = "Excluindo doador...";

      const resultado = await excluirDoador(id);

      // Se o doador excluído estava em edição, limpa o formulário
      const formulario = document.querySelector("#form-doador");

      if (Number(formulario.dataset.editandoId) === id) {
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
document.querySelector("#botao-cancelar-edicao").addEventListener("click", () => {
  cancelarEdicaoDoador();
});

// Inicia a aplicação e trata eventuais erros
iniciarAplicacao().catch((erro) => {
  console.error("Erro inesperado ao iniciar a aplicação:", erro);
});
