export async function verificarAPI() {
  const resposta = await fetch("/api/health");

  if (!resposta.ok) {
    throw new Error("Não foi possível consultar a API.");
  }

  return await resposta.json();
}

// Carrega as categorias cadastradas
export async function carregarCategorias() {
  const resposta = await fetch("/api/categorias");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as categorias.");
  }

  return await resposta.json();
}

// Cadastra um novo doador
export async function cadastrarDoador(dados) {
  const resposta = await fetch("/api/doadores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Não foi possível cadastrar o doador.");
  }

  return resultado;
}

// Carrega todos os doadores
export async function carregarDoadores() {
  const resposta = await fetch("/api/doadores");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar os doadores.");
  }

  return await resposta.json();
}

// Edita os dados de um doador
export async function editarDoador(id, dados) {
  const resposta = await fetch(`/api/doadores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Não foi possível editar o doador.");
  }

  return resultado;
}

// Exclui um doador
export async function excluirDoador(id) {
  const resposta = await fetch(`/api/doadores/${id}`, {
    method: "DELETE",
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Não foi possível excluir o doador.");
  }

  return resultado;
}

// Registra uma nova doação
export async function cadastrarDoacao(dados) {
  const resposta = await fetch("/api/doacoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    throw new Error(resultado.erro || "Não foi possível registrar a doação.");
  }

  return resultado;
}

// Carrega todas as doações cadastradas
export async function carregarDoacoes() {
  const resposta = await fetch("/api/doacoes");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as doações.");
  }

  return await resposta.json();
}
