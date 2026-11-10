-- NutriVida - schema.sql
-- Criacao do banco de dados e suas tabelas

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS nutrivida;

CREATE DATABASE nutrivida
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE nutrivida;


-- TABELA: DOADOR
CREATE TABLE doador (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20) NOT NULL,
    rua VARCHAR(120) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL
);


-- TABELA: CATEGORIA
CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE
);
-- DADOS INICIAIS: CATEGORIA
INSERT INTO categoria (nome, descricao) VALUES
('Grãos e Cereais', 'Arroz, feijão, milho e outros cereais.'),
('Frutas', 'Frutas frescas para doação.'),
('Verduras e Legumes', 'Verduras e legumes frescos.'),
('Leite e Derivados', 'Leite, queijo e outros derivados.'),
('Enlatados', 'Alimentos enlatados e conservados.'),
('Massas', 'Macarrão e outros tipos de massas.');

-- TABELA: USUARIO
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL
);



-- TABELA: FAMILIA
CREATE TABLE familia (
    id_familia INT AUTO_INCREMENT PRIMARY KEY,
    nome_responsavel VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    rua VARCHAR(120) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    quantidade_integrantes INT NOT NULL CHECK (quantidade_integrantes > 0)
);


-- TABELA: DOACAO
CREATE TABLE doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    id_categoria INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    data_doacao DATE NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('pendente', 'recebida', 'distribuida', 'cancelada')
        NOT NULL DEFAULT 'pendente',

    FOREIGN KEY (id_doador)
        REFERENCES doador(id_doador),

    FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
);


-- TABELA: ENTREGA
CREATE TABLE entrega (
    id_entrega INT AUTO_INCREMENT PRIMARY KEY,
    id_doacao INT NOT NULL,
    id_familia INT NOT NULL,
    id_usuario INT NOT NULL,
    data_entrega DATE NOT NULL,

    FOREIGN KEY (id_doacao)
        REFERENCES doacao(id_doacao),

    FOREIGN KEY (id_familia)
        REFERENCES familia(id_familia),

    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);