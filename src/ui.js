// Monta a interface
export function montarInterface() {
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

      <section>
        <h2 id="titulo-form-doador">Cadastro de doadores</h2>

        <form id="form-doador">
          <label>Nome:</label>
          <input name="nome" required />

          <label>CPF:</label>
          <input name="cpf" required />

          <label>Telefone:</label>
          <input name="telefone" required />

          <label>Rua:</label>
          <input name="rua" required />

          <label>Número:</label>
          <input name="numero" required />

          <label>Bairro:</label>
          <input name="bairro" required />

          <label>Cidade:</label>
          <input name="cidade" required />

          <button id="botao-salvar-doador" type="submit">
            Cadastrar doador
          </button>

          <button
            id="botao-cancelar-edicao"
            type="button"
            hidden
          >
            Cancelar edição
          </button>
        </form>

        <p id="doador-status" aria-live="polite"></p>
      </section>

      <section>
        <h2>Doadores cadastrados</h2>

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
              <tr>
                <td colspan="8">Carregando doadores...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>Registrar doação</h2>

        <form id="form-doacao">
          <label for="doacao-doador">Doador:</label>
          <select
            id="doacao-doador"
            name="id_doador"
            required
          >
            <option value="">Selecione um doador</option>
          </select>

          <label for="doacao-categoria">Categoria do alimento:</label>
          <select
            id="doacao-categoria"
            name="id_categoria"
            required
          >
            <option value="">Selecione uma categoria</option>
          </select>

          <label for="doacao-quantidade">Quantidade:</label>
          <input
            id="doacao-quantidade"
            name="quantidade"
            type="number"
            min="1"
            step="1"
            required
          />

          <label for="doacao-data">Data da doação:</label>
          <input
            id="doacao-data"
            name="data_doacao"
            type="date"
            required
          />

          <label for="doacao-descricao">Descrição:</label>
          <textarea
            id="doacao-descricao"
            name="descricao"
            rows="4"
            required
          ></textarea>

          <button id="botao-salvar-doacao" type="submit">
            Registrar doação
          </button>
        </form>

        <p id="doacao-status" aria-live="polite"></p>
      </section>

      <section>
        <h2>Doações cadastradas</h2>

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
              <tr>
                <td colspan="6">Carregando doações...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `;
}

// Atualiza o status da API
export function atualizarStatusAPI(dados) {
  const status = document.querySelector("#api-status");
  const dataHora = new Date(dados.hora).toLocaleString("pt-BR");

  status.textContent = `Conexão: ${dados.status} — NutriVida — ${dataHora}`;
}

// Exibe as categorias
export function exibirCategorias(categorias) {
  const status = document.querySelector("#categorias-status");
  const lista = document.querySelector("#lista-categorias");

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
}

// Preenche as opções de doadores e categorias
export function preencherSelecoesDoacao(doadores, categorias) {
  const selectDoador = document.querySelector("#doacao-doador");
  const selectCategoria = document.querySelector("#doacao-categoria");

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
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  campoData.value = `${ano}-${mes}-${dia}`;
}

// Exibe os doadores cadastrados
export function exibirDoadores(doadores) {
  const lista = document.querySelector("#lista-doadores");

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
    botaoEditar.dataset.acao = "editar";
    botaoEditar.dataset.id = doador.id_doador;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.dataset.acao = "excluir";
    botaoExcluir.dataset.id = doador.id_doador;

    colunaAcoes.append(botaoEditar, botaoExcluir);
    linha.appendChild(colunaAcoes);

    lista.appendChild(linha);
  });
}

// Exibe as doações cadastradas
export function exibirDoacoes(doacoes) {
  const lista = document.querySelector("#lista-doacoes");

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

  doacoes.forEach((doacao) => {
    const linha = document.createElement("tr");

    const dataOriginal = String(doacao.data_doacao);
    const partesData = dataOriginal.slice(0, 10).split("-");

    const dataFormatada =
      partesData.length === 3 ? `${partesData[2]}/${partesData[1]}/${partesData[0]}` : dataOriginal;

    const estados = {
      pendente: "Pendente",
      recebida: "Recebida",
      distribuida: "Distribuída",
      cancelada: "Cancelada",
    };

    const estadoFormatado = estados[doacao.status] || doacao.status || "Não informado";

    const valores = [
      doacao.nome_doador,
      doacao.nome_categoria,
      doacao.quantidade,
      dataFormatada,
      doacao.descricao,
      estadoFormatado,
    ];

    valores.forEach((valor) => {
      const coluna = document.createElement("td");

      coluna.textContent = valor ?? "";
      linha.appendChild(coluna);
    });

    lista.appendChild(linha);
  });
}

// Preenche o formulário para edição
export function prepararEdicaoDoador(doador) {
  const formulario = document.querySelector("#form-doador");

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

  formulario.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

// Limpa o formulário e sai do modo de edição
export function cancelarEdicaoDoador() {
  const formulario = document.querySelector("#form-doador");

  formulario.reset();

  delete formulario.dataset.editandoId;

  document.querySelector("#titulo-form-doador").textContent = "Cadastro de doadores";

  document.querySelector("#botao-salvar-doador").textContent = "Cadastrar doador";

  document.querySelector("#botao-cancelar-edicao").hidden = true;

  document.querySelector("#doador-status").textContent = "";
}
