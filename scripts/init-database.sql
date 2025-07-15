-- Script para criar as tabelas dos novos microserviços no banco EstoqueDB

-- Criar database EstoqueDB se não existir (banco unificado para todos os microserviços)
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EstoqueDB')
BEGIN
    CREATE DATABASE EstoqueDB;
END
GO

-- Usar database EstoqueDB para criar todas as tabelas
USE EstoqueDB;
GO

-- Criar tabela Transacoes (FinanceiroService)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Transacoes' AND xtype='U')
BEGIN
    CREATE TABLE Transacoes (
        TRANSACAO_ID int IDENTITY(1,1) PRIMARY KEY,
        MOVIMENTACAO_ID int NOT NULL,
        VALOR_TOTAL decimal(18,2) NOT NULL,
        TIPO nvarchar(50) NOT NULL
    );
END
GO

-- Criar tabela Funcionarios (FuncionarioService)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Funcionarios' AND xtype='U')
BEGIN
    CREATE TABLE Funcionarios (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Nome nvarchar(100) NOT NULL,
        Email nvarchar(150) NOT NULL,
        Cargo nvarchar(50) NOT NULL,
        Salario decimal(18,2) NOT NULL
    );
END
GO

-- Criar tabela movimentacao (MovimentacaoService)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='movimentacao' AND xtype='U')
BEGIN
    CREATE TABLE movimentacao (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Quantidade int NOT NULL,
        Tipo nvarchar(50) NOT NULL
    );
END
GO

PRINT 'Tabelas criadas com sucesso no banco EstoqueDB para os microserviços FinanceiroService, FuncionarioService e MovimentacaoService';
