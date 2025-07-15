#!/bin/bash

# Script para executar a criação das tabelas no SQL Server

echo "Aguardando SQL Server ficar disponível..."
sleep 30

echo "Criando bancos de dados e tabelas para os microserviços..."

# Executar o script SQL
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SA_PASSWORD -C -i /scripts/init-database.sql

echo "Criação das tabelas concluída!"
