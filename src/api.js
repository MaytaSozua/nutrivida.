export async function verificarAPI() {
  const resposta = await fetch("/api/health");

  if (!resposta.ok) {
    throw new Error("Não foi possível consultar a API.");
  }

  return await resposta.json();
}

export async function carregarCategorias() {
  const resposta = await fetch("/api/categorias");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as categorias.");
  }

  return await resposta.json();
}
