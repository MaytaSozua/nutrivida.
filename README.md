NutriVida

Sistema de gestão de doações de alimentos.

Sobre o projeto

O NutriVida é um projeto acadêmico desenvolvido no âmbito do Projeto Integrador. Seu objetivo é apoiar a gestão de doações de alimentos, contribuindo para a organização das informações relacionadas às doações.

Tecnologias utilizadas

JavaScript

Vite+ para o ambiente de desenvolvimento do frontend

Node.js e Express para a API REST

Git e GitHub para controle de versão e hospedagem do código

Estrutura do projeto

src/: arquivos do frontend

server/: arquivos do backend e da API

public/: arquivos públicos do frontend

package.json: dependências e comandos do projeto

vite.config.ts: configuração do ambiente de desenvolvimento

Como executar o projeto

Pré-requisitos

Vite+ instalado

Acesso ao terminal

Dependências do projeto instaladas

1. Instalar as dependências

Na pasta principal do projeto, execute:

vp install

2. Iniciar a API

Em um terminal, execute:

vp run api

3. Iniciar o frontend

Em outro terminal, na pasta principal do projeto, execute:

vp dev

Abra no navegador o endereço local informado pelo Vite+. No ambiente atual, o endereço é http://localhost:5173.

Verificação da API

A rota GET /api/health verifica se a API está respondendo.

Quando o frontend e a API estão executando corretamente, a página exibe o status da conexão.

Status do desenvolvimento

O projeto está em desenvolvimento. As funcionalidades de gestão de doações serão implementadas ao longo das etapas do Projeto Integrador.
