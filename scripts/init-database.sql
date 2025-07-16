-- Script para criar os bancos de dados e tabelas para os microserviços

-- =======================================================
-- Database: ProdutosDB (para ProdutoService)
-- =======================================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ProdutosDB')
BEGIN
    CREATE DATABASE ProdutosDB;
END
GO

USE ProdutosDB;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Produtos' AND xtype='U')
BEGIN
    CREATE TABLE Produtos (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(255) NOT NULL,
        Descricao NVARCHAR(MAX),
        Preco DECIMAL(18,2) NOT NULL, -- Mantido como Preco para compatibilidade com o log anterior
        Estoque INT NOT NULL DEFAULT 0, -- Mantido como Estoque para compatibilidade com o log anterior
        Ativo BIT NOT NULL DEFAULT 1, -- Adicionado
        DataAtualizacao DATETIME, -- Adicionado
        DataCadastro DATETIME NOT NULL DEFAULT GETDATE(), -- Adicionado
        PrecoCompra DECIMAL(18,2) NOT NULL, -- Adicionado
        PrecoVenda DECIMAL(18,2) NOT NULL, -- Adicionado
        Quantidade INT NOT NULL DEFAULT 0 -- Adicionado
    );
END
GO


PRINT 'Tabelas criadas com sucesso no banco ProdutosDB para o microserviço ProdutoService';
GO

-- =======================================================
-- Database: UsuariosDB (para UsuarioService)
-- =======================================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'UsuariosDB')
BEGIN
    CREATE DATABASE UsuariosDB;
END
GO

USE UsuariosDB;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Usuarios' AND xtype='U')
BEGIN
    CREATE TABLE Usuarios (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        SenhaHash NVARCHAR(255) NOT NULL,
        DataCriacao DATETIME DEFAULT GETDATE()
    );
END
GO

PRINT 'Tabelas criadas com sucesso no banco UsuariosDB para o microserviço UsuarioService';
GO

-- =======================================================
-- Database: EstoqueDB (para FinanceiroService, FuncionarioService, MovimentacaoService)
-- =======================================================
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EstoqueDB')
BEGIN
    CREATE DATABASE EstoqueDB;
END
GO

USE EstoqueDB;
GO

-- Criar tabela Transacoes (FinanceiroService)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Transacoes' AND xtype='U')
BEGIN
    CREATE TABLE Transacoes (
        TRANSACAO_ID INT IDENTITY(1,1) PRIMARY KEY,
        MOVIMENTACAO_ID INT NOT NULL,
        VALOR_TOTAL DECIMAL(18,2) NOT NULL,
        TIPO NVARCHAR(50) NOT NULL
    );
END
GO

-- Criar tabela Funcionarios (FuncionarioService)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Funcionarios' AND xtype='U')
BEGIN
    CREATE TABLE Funcionarios (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Nome NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        Cargo NVARCHAR(50) NOT NULL,
        Salario DECIMAL(18,2) NOT NULL
    );
END
GO

-- Criar tabela movimentacao (MovimentacaoService)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='movimentacao' AND xtype='U')
BEGIN
    CREATE TABLE movimentacao (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Quantidade INT NOT NULL,
        Tipo NVARCHAR(50) NOT NULL
    );
END
GO

PRINT 'Tabelas criadas com sucesso no banco EstoqueDB para os microserviços FinanceiroService, FuncionarioService e MovimentacaoService';
GO
