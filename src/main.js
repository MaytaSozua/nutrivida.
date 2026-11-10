import "./style.css";

import { verificarAPI, carregarCategorias } from "./api.js";

import { montarInterface, atualizarStatusAPI, exibirCategorias } from "./ui.js";

// Monta a interface
montarInterface();

// Verifica a conexão com a API
async function iniciarAplicacao() {
  try {
    const dados = await verificarAPI();
    atualizarStatusAPI(dados);
  } catch (erro) {
    document.querySelector("#api-status").textContent = "Não foi possível conectar à API.";
    console.error(erro);
  }

  try {
    const categorias = await carregarCategorias();
    exibirCategorias(categorias);
  } catch (erro) {
    document.querySelector("#categorias-status").textContent =
      "Não foi possível carregar as categorias.";
    console.error(erro);
  }
}

iniciarAplicacao();
