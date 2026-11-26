NutriVida

Sistema de gestão de doações de alimentos.

Sobre o projeto

O NutriVida é um projeto acadêmico desenvolvido no âmbito do Projeto Integrador. Seu objetivo é apoiar a gestão de doações de alimentos, facilitando o cadastro de doadores, o registro de doações e a consulta das informações.

O sistema possui uma interface web, uma API REST e um banco de dados relacional, além de autenticação para proteger o acesso às funcionalidades.

Tecnologias utilizadas

JavaScript

Vite+ para o ambiente de desenvolvimento do frontend

Node.js e Express para a API REST

MySQL para armazenamento dos dados

JSON Web Token (JWT) para autenticação

bcryptjs para proteção das senhas

Git e GitHub para controle de versão e hospedagem do código

Funcionalidades implementadas

- Login de usuários com e-mail e senha.
- Autenticação baseada em JWT.
- Proteção das rotas da API por token.
- Cadastro, consulta, edição e exclusão de doadores.
- Consulta das categorias de alimentos.
- Registro e consulta de doações.
- Encerramento da sessão pelo botão "Sair da conta".

Estrutura do projeto

src/: arquivos do frontend.

server/: arquivos do backend e da API.

database/: arquivos relacionados ao banco de dados.

public/: arquivos públicos do frontend.

package.json: dependências e comandos do projeto.

vite.config.ts: configuração do ambiente de desenvolvimento.

api.http: requisições para testes manuais da API.

openapi.yaml: documentação dos endpoints da API.

Pré-requisitos

Node.js instalado.

MySQL instalado e em execução.

Vite+ instalado.

Git instalado.

Acesso ao terminal.

Como executar o projeto

1. Clonar o repositório

git clone URL_DO_REPOSITORIO
cd nutrivida

2. Instalar as dependências

Na pasta principal do projeto, execute:

vp install

3. Configurar as variáveis de ambiente

Crie um arquivo .env na raiz do projeto, utilizando o .env.example como referência.

Configure os dados de conexão com o MySQL e as variáveis necessárias para autenticação, incluindo JWT_SECRET e JWT_EXPIRES_IN.

Não compartilhe o arquivo .env nem envie suas senhas ou segredos para o GitHub.

4. Configurar o banco de dados

Crie e configure o banco de dados MySQL utilizando os arquivos SQL disponíveis na pasta database/.

Atenção: confira o conteúdo do schema.sql antes de executá-lo, pois ele pode recriar o banco e apagar dados existentes.

5. Iniciar a API

Em um terminal, na pasta principal do projeto, execute:

vp run api

6. Iniciar o frontend

Em outro terminal, execute:

vp dev

Acesse o endereço local informado pelo Vite+. No ambiente de desenvolvimento atual, o endereço é:

http://localhost:5173

Autenticação

O sistema utiliza autenticação baseada em JWT.

Para acessar as funcionalidades protegidas, o usuário deve realizar o login pela rota:

POST /api/auth/login

Após a autenticação, a API retorna um token JWT. O frontend armazena esse token e o envia nas requisições protegidas por meio do cabeçalho:

Authorization: Bearer TOKEN

Ao encerrar a sessão pelo botão "Sair da conta", os dados de autenticação armazenados no navegador são removidos.

Rotas da API

Método Rota Autenticação

GET /api/health Não

POST /api/auth/login Não

GET /api/categorias Sim

GET /api/doadores Sim

POST /api/doadores Sim

PUT /api/doadores/:id Sim

DELETE /api/doadores/:id Sim

GET /api/doacoes Sim

POST /api/doacoes Sim

A documentação completa está disponível no arquivo openapi.yaml.

Os testes manuais das requisições estão disponíveis em api.http.

Verificação da API

Com a API em execução, acesse:

http://localhost:3000/api/health

A rota deve retornar um JSON indicando que a API está funcionando.

Backup do banco de dados

O banco de dados pode ser exportado utilizando a ferramenta mysqldump do MySQL.

O arquivo de backup deve ser armazenado em local seguro, pois pode conter dados pessoais. Não deve ser enviado ao GitHub.

Status do desenvolvimento

O NutriVida encontra-se em desenvolvimento no âmbito do Projeto Integrador. As funcionalidades implementadas incluem autenticação de usuários, gerenciamento de doadores e gerenciamento de doações.

Novas funcionalidades e melhorias poderão ser incorporadas nas próximas etapas do projeto.
