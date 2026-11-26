const TOKEN_KEY = "nutrivida_token";
const USUARIO_KEY = "nutrivida_usuario";

// Realiza requisições para a API
async function requisicao(url, opcoes = {}, protegida = true) {
  const headers = {
    ...opcoes.headers,
  };

  if (opcoes.body) {
    headers["Content-Type"] = "application/json";
  }

  if (protegida) {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      throw new Error("Faça login para continuar.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(url, {
    ...opcoes,
    headers,
  });

  const resultado = await resposta.json();

  if (!resposta.ok) {
    if (resposta.status === 401 && protegida) {
      sair();
    }

    throw new Error(resultado.erro || "Ocorreu um erro ao comunicar com a API.");
  }

  return resultado;
}

// Verifica se a API está funcionando (rota pública)
export async function verificarAPI() {
  return await requisicao("/api/health", {}, false);
}

// Realiza o login
export async function entrar(email, senha) {
  const resultado = await requisicao(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    },
    false,
  );

  localStorage.setItem(TOKEN_KEY, resultado.token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(resultado.usuario));

  return resultado;
}

// Encerra a sessão
export function sair() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}

// Consulta o utilizador autenticado no navegador
export function obterUsuario() {
  const usuario = localStorage.getItem(USUARIO_KEY);

  return usuario ? JSON.parse(usuario) : null;
}

// Verifica se existe um token guardado
export function estaAutenticado() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

// Carrega as categorias cadastradas
export async function carregarCategorias() {
  return await requisicao("/api/categorias");
}

// Cadastra um novo doador
export async function cadastrarDoador(dados) {
  return await requisicao("/api/doadores", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

// Carrega todos os doadores
export async function carregarDoadores() {
  return await requisicao("/api/doadores");
}

// Edita os dados de um doador
export async function editarDoador(id, dados) {
  return await requisicao(`/api/doadores/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

// Exclui um doador
export async function excluirDoador(id) {
  return await requisicao(`/api/doadores/${id}`, {
    method: "DELETE",
  });
}

// Registra uma nova doação
export async function cadastrarDoacao(dados) {
  return await requisicao("/api/doacoes", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

// Carrega todas as doações cadastradas
export async function carregarDoacoes() {
  return await requisicao("/api/doacoes");
}
