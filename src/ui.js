// Cria a estrutura principal da aplicação
export function montarInterface() {
  document.querySelector("#app").innerHTML = `
    <div class="layout-principal">
      <aside class="menu-lateral">
        <div class="marca">
          <div class="marca-icone">N</div>
          <div>
            <h1>NutriVida</h1>
            <p>Gestão de doações</p>
          </div>
        </div>

        <nav class="navegacao">
          <a href="#/inicio" data-rota="/inicio">Início</a>
          <a href="#/doadores" data-rota="/doadores">Doadores</a>
          <a href="#/doacoes/nova" data-rota="/doacoes/nova">Registrar doação</a>
          <a href="#/doacoes" data-rota="/doacoes">Doações</a>
        </nav>

        <div class="menu-rodape">
          <span class="indicador-api"></span>
          <div>
            <strong>Estado do sistema</strong>
            <p id="api-status">Verificando conexão...</p>
          </div>
        </div>
      </aside>

      <main class="conteudo-principal">
        <div id="conteudo-pagina"></div>
      </main>
    </div>
  `;

  renderizarPagina(location.hash || "#/inicio");
}

// Mostra a página selecionada
export function renderizarPagina(hash) {
  const conteudo = document.querySelector("#conteudo-pagina");
  if (!conteudo) return;

  const rota = hash.replace("#", "") || "/inicio";

  if (rota === "/doadores") {
    conteudo.innerHTML = paginaDoadores();
  } else if (rota === "/doacoes/nova") {
    conteudo.innerHTML = paginaNovaDoacao();
  } else if (rota === "/doacoes") {
    conteudo.innerHTML = paginaDoacoes();
  } else {
    conteudo.innerHTML = paginaInicio();
  }

  document.querySelectorAll(".navegacao a").forEach((link) => {
    const ativo = link.dataset.rota === rota;
    link.classList.toggle("ativo", ativo);

    if (ativo) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// Página inicial
function paginaInicio() {
  return `
    <header class="cabecalho-pagina">
      <div>
        <span class="sobretitulo">PAINEL PRINCIPAL</span>
        <h2>Bem-vindo ao NutriVida</h2>
        <p>Organize doações e acompanhe as ações de apoio alimentar.</p>
      </div>
    </header>

    <section class="cartao-boas-vindas">
      <div>
        <span class="sobretitulo">JUNTOS FAZEMOS A DIFERENÇA</span>
        <h3>Alimento partilhado é cuidado multiplicado.</h3>
        <p>
          Registe doadores, acompanhe as doações e ajude a organizar
          os alimentos que chegam a quem precisa.
        </p>
        <a class="botao-principal" href="#/doacoes/nova">
          Registrar uma doação
        </a>
      </div>
      <div class="ilustracao-boas-vindas" aria-hidden="true">🌱</div>
    </section>

    <section class="secao-painel">
      <div class="titulo-secao">
        <div>
          <span class="sobretitulo">RESUMO</span>
          <h3>Indicadores do sistema</h3>
        </div>
      </div>

      <div class="grade-indicadores">
        <article class="cartao-indicador">
          <span class="indicador-icone">👥</span>
          <p>Doadores cadastrados</p>
          <strong id="total-doadores">—</strong>
        </article>

        <article class="cartao-indicador">
          <span class="indicador-icone">🎁</span>
          <p>Doações registradas</p>
          <strong id="total-doacoes">—</strong>
        </article>

        <article class="cartao-indicador">
          <span class="indicador-icone">🥕</span>
          <p>Categorias de alimentos</p>
          <strong id="total-categorias">—</strong>
        </article>
      </div>
    </section>

    <section class="secao-painel">
      <div class="titulo-secao">
        <div>
          <span class="sobretitulo">ACESSO RÁPIDO</span>
          <h3>O que deseja fazer?</h3>
        </div>
      </div>

      <div class="grade-atalhos">
        <a class="cartao-atalho" href="#/doadores">
          <span>👥</span>
          <div>
            <strong>Gerir doadores</strong>
            <p>Cadastrar, consultar e atualizar doadores.</p>
          </div>
          <span class="seta-atalho">→</span>
        </a>

        <a class="cartao-atalho" href="#/doacoes/nova">
          <span>🎁</span>
          <div>
            <strong>Registrar doação</strong>
            <p>Registar uma nova contribuição alimentar.</p>
          </div>
          <span class="seta-atalho">→</span>
        </a>

        <a class="cartao-atalho" href="#/doacoes">
          <span>📋</span>
          <div>
            <strong>Consultar doações</strong>
            <p>Visualizar o histórico de doações.</p>
          </div>
          <span class="seta-atalho">→</span>
        </a>
      </div>
    </section>
  `;
}

// Página de cadastro e consulta de doadores
function paginaDoadores() {
  return `
    <header class="cabecalho-pagina">
      <div>
        <span class="sobretitulo">GESTÃO DE PESSOAS</span>
        <h2>Doadores</h2>
        <p>Cadastre novos doadores e consulte os seus dados.</p>
      </div>
    </header>

    <section class="cartao-conteudo">
      <div class="titulo-secao">
        <div>
          <span class="sobretitulo">FORMULÁRIO</span>
          <h3 id="titulo-form-doador">Cadastro de doadores</h3>
        </div>
      </div>

      <form id="form-doador" class="formulario">
        <div class="grade-formulario">
          <div class="campo campo-largo">
            <label for="doador-nome">Nome completo</label>
            <input id="doador-nome" name="nome" required />
          </div>

          <div class="campo">
            <label for="doador-cpf">CPF</label>
            <input id="doador-cpf" name="cpf" required />
          </div>

          <div class="campo">
            <label for="doador-telefone">Telefone</label>
            <input id="doador-telefone" name="telefone" required />
          </div>

          <div class="campo campo-largo">
            <label for="doador-rua">Rua</label>
            <input id="doador-rua" name="rua" required />
          </div>

          <div class="campo">
            <label for="doador-numero">Número</label>
            <input id="doador-numero" name="numero" required />
          </div>

          <div class="campo">
            <label for="doador-bairro">Bairro</label>
            <input id="doador-bairro" name="bairro" required />
          </div>

          <div class="campo">
            <label for="doador-cidade">Cidade</label>
            <input id="doador-cidade" name="cidade" required />
          </div>
        </div>

        <div class="acoes-formulario">
          <button id="botao-salvar-doador" class="botao-principal" type="submit">
            Cadastrar doador
          </button>
          <button id="botao-cancelar-edicao" class="botao-secundario" type="button" hidden>
            Cancelar edição
          </button>
        </div>
      </form>

      <p id="doador-status" class="mensagem-status" aria-live="polite"></p>
    </section>

    <section class="cartao-conteudo">
      <div class="titulo-secao">
        <div>
          <span class="sobretitulo">REGISTOS</span>
          <h3>Doadores cadastrados</h3>
        </div>
      </div>

      <div class="tabela-container">
        <table id="tabela-doadores">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Rua</th>
              <th>Número</th>
              <th>Bairro</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody id="lista-doadores">
            <tr><td colspan="8">Carregando doadores...</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

// Página de registo de doação
function paginaNovaDoacao() {
  return `
    <header class="cabecalho-pagina">
      <div>
        <span class="sobretitulo">CONTRIBUIÇÕES</span>
        <h2>Registrar doação</h2>
        <p>Preencha os dados para registar uma nova doação alimentar.</p>
      </div>
    </header>

    <section class="cartao-conteudo cartao-formulario-doacao">
      <div class="titulo-secao">
        <div>
          <span class="sobretitulo">NOVA ENTRADA</span>
          <h3>Dados da doação</h3>
        </div>
      </div>

      <form id="form-doacao" class="formulario">
        <div class="grade-formulario">
          <div class="campo">
            <label for="doacao-doador">Doador</label>
            <select id="doacao-doador" name="id_doador" required>
              <option value="">Selecione um doador</option>
            </select>
          </div>

          <div class="campo">
            <label for="doacao-categoria">Categoria do alimento</label>
            <select id="doacao-categoria" name="id_categoria" required>
              <option value="">Selecione uma categoria</option>
            </select>
          </div>

          <div class="campo">
            <label for="doacao-quantidade">Quantidade</label>
            <input
              id="doacao-quantidade"
              name="quantidade"
              type="number"
              min="1"
              step="1"
              required
            />
          </div>

          <div class="campo">
            <label for="doacao-data">Data da doação</label>
            <input id="doacao-data" name="data_doacao" type="date" required />
          </div>

          <div class="campo campo-largo">
            <label for="doacao-descricao">Descrição</label>
            <textarea
              id="doacao-descricao"
              name="descricao"
              rows="4"
              required
            ></textarea>
          </div>
        </div>

        <div class="acoes-formulario">
          <button id="botao-salvar-doacao" class="botao-principal" type="submit">
            Registrar doação
          </button>
        </div>
      </form>

      <p id="doacao-status" class="mensagem-status" aria-live="polite"></p>
    </section>
  `;
}

// Página de consulta das doações
function paginaDoacoes() {
  return `
    <header class="cabecalho-pagina">
      <div>
        <span class="sobretitulo">ACOMPANHAMENTO</span>
        <h2>Doações cadastradas</h2>
        <p>Consulte o histórico das contribuições registadas no sistema.</p>
      </div>
      <a class="botao-principal" href="#/doacoes/nova">+ Nova doação</a>
    </header>

    <section class="cartao-conteudo">
      <div class="titulo-secao">
        <div>
          <span class="sobretitulo">HISTÓRICO</span>
          <h3>Lista de doações</h3>
        </div>
      </div>

      <div class="tabela-container">
        <table id="tabela-doacoes">
          <thead>
            <tr>
              <th>Doador</th>
              <th>Categoria</th>
              <th>Quantidade</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody id="lista-doacoes">
            <tr><td colspan="6">Carregando doações...</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

// Atualiza o estado da API
export function atualizarStatusAPI(dados) {
  const status = document.querySelector("#api-status");
  if (!status) return;

  const dataHora = new Date(dados.hora).toLocaleString("pt-BR");
  status.textContent = `Conectado — ${dataHora}`;
}

// Atualiza os indicadores da página inicial
export function atualizarIndicadores(doadores, doacoes, categorias) {
  const totalDoadores = document.querySelector("#total-doadores");
  const totalDoacoes = document.querySelector("#total-doacoes");
  const totalCategorias = document.querySelector("#total-categorias");

  if (totalDoadores) totalDoadores.textContent = doadores.length;
  if (totalDoacoes) totalDoacoes.textContent = doacoes.length;
  if (totalCategorias) {
    totalCategorias.textContent = categorias.filter((categoria) => Boolean(categoria.ativo)).length;
  }
}

// Exibe as categorias, caso exista uma área para isso
export function exibirCategorias(categorias) {
  const status = document.querySelector("#categorias-status");
  const lista = document.querySelector("#lista-categorias");

  if (!status || !lista) return;

  lista.replaceChildren();

  if (categorias.length === 0) {
    status.textContent = "Nenhuma categoria cadastrada.";
    return;
  }

  categorias.forEach((categoria) => {
    const item = document.createElement("li");
    item.textContent = categoria.nome;
    lista.appendChild(item);
  });

  status.textContent = `${categorias.length} categorias encontradas.`;
}

// Preenche as opções dos campos de doador e categoria
export function preencherSelecoesDoacao(doadores, categorias) {
  const selectDoador = document.querySelector("#doacao-doador");
  const selectCategoria = document.querySelector("#doacao-categoria");

  if (!selectDoador || !selectCategoria) return;

  selectDoador.replaceChildren();
  selectCategoria.replaceChildren();

  const opcaoDoador = document.createElement("option");
  opcaoDoador.value = "";
  opcaoDoador.textContent = "Selecione um doador";
  selectDoador.appendChild(opcaoDoador);

  doadores.forEach((doador) => {
    const opcao = document.createElement("option");
    opcao.value = doador.id_doador;
    opcao.textContent = doador.nome;
    selectDoador.appendChild(opcao);
  });

  const opcaoCategoria = document.createElement("option");
  opcaoCategoria.value = "";
  opcaoCategoria.textContent = "Selecione uma categoria";
  selectCategoria.appendChild(opcaoCategoria);

  categorias
    .filter((categoria) => Boolean(categoria.ativo))
    .forEach((categoria) => {
      const opcao = document.createElement("option");
      opcao.value = categoria.id_categoria;
      opcao.textContent = categoria.nome;
      selectCategoria.appendChild(opcao);
    });

  selectDoador.disabled = doadores.length === 0;
  selectCategoria.disabled = !categorias.some((categoria) => Boolean(categoria.ativo));
}

// Define a data atual no formulário de doação
export function definirDataAtualDoacao() {
  const campoData = document.querySelector("#doacao-data");
  if (!campoData) return;

  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  campoData.value = `${ano}-${mes}-${dia}`;
}

// Exibe os doadores na tabela
export function exibirDoadores(doadores) {
  const lista = document.querySelector("#lista-doadores");
  if (!lista) return;

  lista.replaceChildren();

  if (doadores.length === 0) {
    const linha = document.createElement("tr");
    const coluna = document.createElement("td");
    coluna.colSpan = 8;
    coluna.textContent = "Nenhum doador cadastrado.";
    linha.appendChild(coluna);
    lista.appendChild(linha);
    return;
  }

  doadores.forEach((doador) => {
    const linha = document.createElement("tr");

    [
      doador.nome,
      doador.cpf,
      doador.telefone,
      doador.rua,
      doador.numero,
      doador.bairro,
      doador.cidade,
    ].forEach((valor) => {
      const coluna = document.createElement("td");
      coluna.textContent = valor ?? "";
      linha.appendChild(coluna);
    });

    const colunaAcoes = document.createElement("td");

    const botaoEditar = document.createElement("button");
    botaoEditar.type = "button";
    botaoEditar.textContent = "Editar";
    botaoEditar.className = "botao-tabela";
    botaoEditar.dataset.acao = "editar";
    botaoEditar.dataset.id = doador.id_doador;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.className = "botao-tabela botao-excluir";
    botaoExcluir.dataset.acao = "excluir";
    botaoExcluir.dataset.id = doador.id_doador;

    colunaAcoes.append(botaoEditar, botaoExcluir);
    linha.appendChild(colunaAcoes);
    lista.appendChild(linha);
  });
}

// Exibe as doações na tabela
export function exibirDoacoes(doacoes) {
  const lista = document.querySelector("#lista-doacoes");
  if (!lista) return;

  lista.replaceChildren();

  if (doacoes.length === 0) {
    const linha = document.createElement("tr");
    const coluna = document.createElement("td");
    coluna.colSpan = 6;
    coluna.textContent = "Nenhuma doação cadastrada.";
    linha.appendChild(coluna);
    lista.appendChild(linha);
    return;
  }

  const estados = {
    pendente: "Pendente",
    recebida: "Recebida",
    distribuida: "Distribuída",
    cancelada: "Cancelada",
  };

  doacoes.forEach((doacao) => {
    const linha = document.createElement("tr");
    const dataOriginal = String(doacao.data_doacao);
    const partesData = dataOriginal.slice(0, 10).split("-");
    const dataFormatada =
      partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : dataOriginal;

    const valores = [
      doacao.nome_doador,
      doacao.nome_categoria,
      doacao.quantidade,
      dataFormatada,
      doacao.descricao,
      estados[doacao.status] || doacao.status || "Não informado",
    ];

    valores.forEach((valor) => {
      const coluna = document.createElement("td");
      coluna.textContent = valor ?? "";
      linha.appendChild(coluna);
    });

    lista.appendChild(linha);
  });
}

// Preenche o formulário para editar um doador
export function prepararEdicaoDoador(doador) {
  const formulario = document.querySelector("#form-doador");
  if (!formulario) return;

  formulario.elements.nome.value = doador.nome;
  formulario.elements.cpf.value = doador.cpf;
  formulario.elements.telefone.value = doador.telefone;
  formulario.elements.rua.value = doador.rua;
  formulario.elements.numero.value = doador.numero;
  formulario.elements.bairro.value = doador.bairro;
  formulario.elements.cidade.value = doador.cidade;

  formulario.dataset.editandoId = doador.id_doador;

  document.querySelector("#titulo-form-doador").textContent = "Editar doador";
  document.querySelector("#botao-salvar-doador").textContent = "Salvar alterações";
  document.querySelector("#botao-cancelar-edicao").hidden = false;
  document.querySelector("#doador-status").textContent =
    "Altere os dados do doador e clique em Salvar alterações.";

  formulario.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Cancela a edição de um doador
export function cancelarEdicaoDoador() {
  const formulario = document.querySelector("#form-doador");
  if (!formulario) return;

  formulario.reset();
  delete formulario.dataset.editandoId;

  document.querySelector("#titulo-form-doador").textContent = "Cadastro de doadores";
  document.querySelector("#botao-salvar-doador").textContent = "Cadastrar doador";
  document.querySelector("#botao-cancelar-edicao").hidden = true;
  document.querySelector("#doador-status").textContent = "";
}
