import "./style.css";

document.querySelector("#app").innerHTML = `
  <main>
    <h1>NutriVida</h1>
    <p>Sistema de gestão de doações de alimentos</p>

    <section>
      <h2>Status da API</h2>
      <p id="api-status">Verificando conexão...</p>
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

verificarAPI().catch(console.error);
