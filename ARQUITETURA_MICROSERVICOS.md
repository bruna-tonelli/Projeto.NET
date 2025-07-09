# Arquitetura de Microsserviços - Sistema de Controle de Estoque

## 📋 Visão Geral

Esta aplicação foi transformada de uma arquitetura monolítica para uma arquitetura de microsserviços usando Docker, .NET 8, e Angular.

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │
│   (Angular)     │◄──►│   (Ocelot)      │
│   Port: 4200    │    │   Port: 5000    │
└─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼──┐      │   ┌─────▼─────┐
            │ Produto  │      │   │  Usuario  │
            │ Service  │      │   │  Service  │
            │(+Estoque)│      │   │Port: 5002 │
            │Port: 5001│      │   └───────────┘
            └──────────┘      │         │
                    │         │         │
                    └─────────┼─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   SQL Server      │
                    │   Port: 1433      │
                    └───────────────────┘
```

## 🚀 Microsserviços

### 1. **API Gateway** (Port: 5000)
- **Responsabilidade:** Roteamento de requisições, CORS, Load Balancing
- **Tecnologia:** .NET 8 + Ocelot
- **Endpoints:** Todos os endpoints são roteados através deste gateway

### 2. **ProdutoService** (Port: 5001)
- **Responsabilidade:** CRUD de produtos + Gestão de estoque
- **Endpoints:**
  - `GET /api/produtos` - Listar produtos
  - `POST /api/produtos` - Criar produto
  - `PUT /api/produtos/{id}` - Atualizar produto
  - `DELETE /api/produtos/{id}` - Deletar produto
  - `GET /api/produtos/pesquisar` - Pesquisar produtos
  - `GET /api/estoque` - Consultar estoque
  - `GET /api/estoque/pesquisar` - Pesquisar no estoque
  - `PUT /api/estoque/{id}/quantidade` - Atualizar quantidade

### 3. **UsuarioService** (Port: 5002)
- **Responsabilidade:** Autenticação e gestão de usuários
- **Endpoints:**
  - `POST /api/usuarios/login` - Login
  - `POST /api/usuarios/register` - Registro
  - `GET /api/usuarios/profile` - Perfil do usuário

## 🐳 Como Executar

### Pré-requisitos
- Docker e Docker Compose
- .NET 8 SDK
- Node.js 18+

### Executar com Docker Compose
```bash
# Na raiz do projeto
docker-compose up --build
```

### URLs dos Serviços
- **Frontend:** http://localhost:4200
- **API Gateway:** http://localhost:5000
- **ProdutoService:** http://localhost:5001
- **UsuarioService:** http://localhost:5002
- **SQL Server:** localhost:1433

## 🔧 Desenvolvimento Local

### Backend
```bash
# ProdutoService
cd backend/ProdutoService
dotnet run

# UsuarioService
cd backend/UsuarioService/UsuarioService
dotnet run

# API Gateway
cd backend/ApiGateway/ApiGateway
dotnet run
```

### Frontend
```bash
cd frontend/estoque-app
npm install
npm start
```

## 📊 Benefícios da Arquitetura de Microsserviços

1. **Escalabilidade Independent:** Cada serviço pode ser escalado independentemente
2. **Tecnologias Diversas:** Cada serviço pode usar tecnologias diferentes
3. **Falhas Isoladas:** Falha em um serviço não afeta os outros
4. **Deploy Independente:** Cada serviço pode ser deployado separadamente
5. **Equipes Autônomas:** Diferentes equipes podem trabalhar em diferentes serviços

## 🔐 Segurança

- **API Gateway:** Centraliza autenticação e autorização
- **CORS:** Configurado para permitir requisições do frontend
- **JWT Tokens:** Para autenticação entre serviços

## 📈 Monitoramento e Observabilidade

- **Logs Centralizados:** Cada serviço gera logs estruturados
- **Health Checks:** Endpoints de saúde em cada serviço
- **Métricas:** Prometheus/Grafana (pode ser adicionado)

## 🔄 Próximos Passos

1. **Service Discovery:** Implementar Consul ou Eureka
2. **Circuit Breaker:** Adicionar Polly para resiliência
3. **Distributed Tracing:** OpenTelemetry
4. **Event-Driven Architecture:** RabbitMQ ou Apache Kafka
5. **Caching:** Redis distribuído
6. **Monitoring:** Prometheus + Grafana
