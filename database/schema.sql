USE nutrivida;

CREATE TABLE IF NOT EXISTS doador (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(30),
    telefone VARCHAR(20),
    email VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS familia (
    id_familia INT AUTO_INCREMENT PRIMARY KEY,
    nome_responsavel VARCHAR(150) NOT NULL,
    quantidade_pessoas INT NOT NULL,
    telefone VARCHAR(20),
    rua VARCHAR(120) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    id_categoria INT NOT NULL,
    quantidade INT NOT NULL,
    data_doacao DATE NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('pendente', 'recebida', 'distribuida', 'cancelada')
        DEFAULT 'pendente',
    FOREIGN KEY (id_doador) REFERENCES doador(id_doador),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);