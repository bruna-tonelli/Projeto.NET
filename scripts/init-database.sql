-- Criação dos bancos de dados
IF DB_ID('ProdutosDB') IS NULL
    CREATE DATABASE ProdutosDB;
GO

IF DB_ID('UsuariosDB') IS NULL
    CREATE DATABASE UsuariosDB;
GO

IF DB_ID('EstoqueDB') IS NULL
    CREATE DATABASE EstoqueDB;
GO

-- Tabelas do ProdutosDB
USE ProdutosDB;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Produtos' AND xtype='U')
BEGIN
    CREATE TABLE produtos (
        Id INT IDENTITY PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Quantidade INT NOT NULL,
        PrecoVenda DECIMAL(18,2) NOT NULL
    );
END
GO

-- Tabelas do UsuariosDB
USE UsuariosDB;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
BEGIN
    CREATE TABLE Usuarios (
        Id INT IDENTITY PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL,
        Senha NVARCHAR(100) NOT NULL
    );
END
GO

-- Tabelas do EstoqueDB
USE EstoqueDB;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Inventarios' AND xtype='U')
BEGIN
    CREATE TABLE Inventarios (
        Id INT IDENTITY PRIMARY KEY,
        DataCriacao DATETIME NOT NULL DEFAULT GETDATE(),
        Responsavel NVARCHAR(100),
        Status NVARCHAR(50)
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='InventarioProdutos' AND xtype='U')
BEGIN
    CREATE TABLE InventarioProdutos (
        Id INT IDENTITY PRIMARY KEY,
        InventarioId INT NOT NULL,
        ProdutoId INT NOT NULL,
        QuantidadeContada INT NOT NULL,
        FOREIGN KEY (InventarioId) REFERENCES Inventarios(Id)
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Movimentacoes' AND xtype='U')
BEGIN
    CREATE TABLE movimentacao (
        Id INT IDENTITY PRIMARY KEY,
        ProdutoId INT NOT NULL,
        Quantidade INT NOT NULL,
        Tipo NVARCHAR(50) NOT NULL,
        DataMovimentacao DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Funcionarios' AND xtype='U')
BEGIN
    CREATE TABLE Funcionarios (
        Id INT IDENTITY PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Cargo NVARCHAR(100),
        DataAdmissao DATETIME
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Financeiro' AND xtype='U')
BEGIN
    CREATE TABLE Financeiro (
        Id INT IDENTITY PRIMARY KEY,
        Tipo NVARCHAR(50) NOT NULL,
        Valor DECIMAL(18,2) NOT NULL,
        DataLancamento DATETIME NOT NULL DEFAULT GETDATE()
    );
END
GO