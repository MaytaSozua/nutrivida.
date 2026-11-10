import "./style.css";

document.querySelector("#app").innerHTML = `
  <main>
    <h1>NutriVida</h1>
    <p>Sistema de gestão de doações de alimentos</p>

    <section>
      <h2>Status da API</h2>
      <p id="api-status">Verificando conexão...</p>
    </section>

    <section>
      <h2>Categorias de alimentos</h2>
      <p id="categorias-status">Carregando categorias...</p>
      <ul id="lista-categorias"></ul>
    </section>
  </main>
`;

async function verificarAPI() {
  const status = document.querySelector("#api-status");

  try {
    const resposta = await fetch("/api/health");

    if (!resposta.ok) {
      throw new Error("Não foi possível consultar a API.");
    }

    const dados = await resposta.json();
    const dataHora = new Date(dados.hora).toLocaleString("pt-BR");

    status.textContent = `Conexão: ${dados.status} — NutriVida — ${dataHora}`;
  } catch (erro) {
    status.textContent = "Não foi possível conectar à API.";
    console.error(erro);
  }
}

async function carregarCategorias() {
  const status = document.querySelector("#categorias-status");
  const lista = document.querySelector("#lista-categorias");

  try {
    const resposta = await fetch("/api/categorias");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar as categorias.");
    }

    const categorias = await resposta.json();

    lista.replaceChildren();

    if (categorias.length === 0) {
      status.textContent = "Nenhuma categoria cadastrada.";
      return;
    }

    categorias.forEach((categoria) => {
      const item = document.createElement("li");
      const nome = document.createElement("strong");
      const descricao = document.createElement("p");

      nome.textContent = categoria.nome;
      descricao.textContent = categoria.descricao || "Sem descrição";

      item.append(nome, descricao);
      lista.appendChild(item);
    });

    status.textContent = `${categorias.length} categorias encontradas.`;
  } catch (erro) {
    status.textContent = "Não foi possível carregar as categorias.";
    console.error(erro);
  }
}

verificarAPI();
carregarCategorias();
