# Arquitetura de Microsserviços - Sistema de Controle de Estoque

## 📋 Visão Geral

Sistema completo de controle de estoque baseado em arquitetura de microsserviços, desenvolvido com .NET 8, Angular 18, SQL Server e Redis, orquestrado com Docker Compose.

## 🏗️ Arquitetura Geral

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │     Redis       │
│   (Angular 18)  │◄──►│   (Ocelot)      │    │   (Cache)       │
│   Port: 4200    │    │   Port: 5000    │    │  Port: 6379     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
        ┌───────────▼──┐      │     ┌───▼──────────┐
        │ Usuario      │      │     │ Produto      │
        │ Service      │      │     │ Service      │
        │ (Auth+JWT)   │      │     │ (+Estoque)   │
        │ Port: 5002   │      │     │ Port: 5001   │
        └──────────────┘      │     └──────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼─────┐          ┌────▼──────┐        ┌────▼──────────┐
   │Financeiro│          │Funcionario│        │ Movimentacao  │
   │ Service  │          │  Service  │        │   Service     │
   │Port: 5003│          │Port: 5004 │        │ Port: 5005    │
   └──────────┘          └───────────┘        └───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   SQL Server      │
                    │ (Multi-Database)  │
                    │   Port: 1433      │
                    │ UsuariosDB        │
                    │ ProdutosDB        │
                    │ EstoqueDB         │
                    └───────────────────┘
```

## 🚀 Microsserviços Detalhados

### 1. **API Gateway** (Port: 5000)
- **Tecnologia:** .NET 8 + Ocelot Gateway
- **Responsabilidade:** 
  - Roteamento centralizado de todas as requisições
  - Load balancing entre instâncias
  - CORS e políticas de segurança
  - Point de entrada único para o frontend
- **Rotas Configuradas:**
  - `/api/auth/*` → Usuario Service
  - `/api/usuarios/*` → Usuario Service  
  - `/api/produtos/*` → Produto Service
  - `/api/estoque/*` → Produto Service
  - `/api/funcionarios/*` → Funcionario Service
  - `/api/movimentacao/*` → Movimentacao Service
  - `/api/financeiro/*` → Financeiro Service

### 2. **Usuario Service** (Port: 5002)
- **Tecnologia:** .NET 8 + Entity Framework Core + BCrypt + JWT
- **Database:** UsuariosDB (SQL Server)
- **Responsabilidade:** Autenticação, autorização e gestão de usuários
- **Funcionalidades:**
  - Registro e login de usuários
  - Geração e validação de tokens JWT
  - Gestão de perfis e roles (Admin, User)
  - Hash seguro de senhas com BCrypt
  - Controle de tentativas de login
  - Auditoria de acessos
- **Endpoints Principais:**
  ```
  POST /api/auth/login          - Login com email/senha
  POST /api/auth/register       - Registro de novos usuários  
  GET  /api/auth/users          - Listar usuários (Admin)
  GET  /api/auth/users/{id}     - Detalhes de usuário
  DELETE /api/auth/users/{id}   - Excluir usuário (Admin)
  ```
- **Modelo de Dados:**
  ```csharp
  public class Usuario {
      public string Id { get; set; }
      public string Name { get; set; }
      public string Email { get; set; }
      public string PasswordHash { get; set; }
      public string Role { get; set; }
      public string? Phone { get; set; }
      public DateTime CreatedAt { get; set; }
      public DateTime? UpdatedAt { get; set; }
      public bool IsActive { get; set; }
      public int FailedLoginAttempts { get; set; }
      public DateTime? LockoutEnd { get; set; }
  }
  ```

### 3. **Produto Service** (Port: 5001)
- **Tecnologia:** .NET 8 + Entity Framework Core
- **Database:** ProdutosDB (SQL Server)
- **Responsabilidade:** Gestão de produtos e controle de estoque integrado
- **Funcionalidades:**
  - CRUD completo de produtos
  - Controle de estoque em tempo real
  - Pesquisa e filtros avançados
  - Validação de quantidade mínima
  - Histórico de alterações
- **Endpoints Principais:**
  ```
  GET    /api/produtos           - Listar produtos
  POST   /api/produtos           - Criar produto
  PUT    /api/produtos/{id}      - Atualizar produto
  DELETE /api/produtos/{id}      - Excluir produto
  GET    /api/produtos/pesquisar - Buscar produtos
  GET    /api/estoque            - Consultar estoque
  GET    /api/estoque/pesquisar  - Buscar no estoque
  PUT    /api/estoque/{id}/quantidade - Atualizar quantidade
  ```

### 4. **Funcionario Service** (Port: 5004)
- **Tecnologia:** .NET 8 + Entity Framework Core
- **Database:** EstoqueDB (SQL Server)
- **Responsabilidade:** Gestão de funcionários e recursos humanos
- **Funcionalidades:**
  - CRUD de funcionários
  - Integração com sistema de usuários
  - Controle de cargos e salários
  - Relatórios de funcionários
- **Endpoints Principais:**
  ```
  GET    /api/funcionarios       - Listar funcionários
  POST   /api/funcionarios       - Criar funcionário
  PUT    /api/funcionarios/{id}  - Atualizar funcionário
  DELETE /api/funcionarios/{id}  - Excluir funcionário
  ```

### 5. **Movimentacao Service** (Port: 5005)
- **Tecnologia:** .NET 8 + Entity Framework Core
- **Database:** EstoqueDB (SQL Server)
- **Responsabilidade:** Controle de movimentações de estoque
- **Funcionalidades:**
  - Registro de entradas e saídas
  - Histórico de movimentações
  - Integração com produto service
  - Relatórios de movimentação
- **Endpoints Principais:**
  ```
  GET    /api/movimentacao       - Listar movimentações
  POST   /api/movimentacao       - Registrar movimentação
  PUT    /api/movimentacao/{id}  - Atualizar movimentação
  DELETE /api/movimentacao/{id}  - Excluir movimentação
  ```

### 6. **Financeiro Service** (Port: 5003)
- **Tecnologia:** .NET 8 + Entity Framework Core
- **Database:** EstoqueDB (SQL Server)
- **Responsabilidade:** Gestão financeira e transações
- **Funcionalidades:**
  - Controle de transações financeiras
  - Relatórios financeiros
  - Integração com movimentações
  - Cálculos de custos e valores
- **Endpoints Principais:**
  ```
  GET    /api/financeiro         - Listar transações
  POST   /api/financeiro         - Criar transação
  PUT    /api/financeiro/{id}    - Atualizar transação
  DELETE /api/financeiro/{id}    - Excluir transação
  ```

## 🌐 Frontend (Angular 18)

### **Arquitetura do Frontend**
- **Tecnologia:** Angular 18 + TypeScript + Standalone Components
- **Styling:** SCSS modular com design responsivo
- **Autenticação:** JWT Guards e Interceptors
- **Estado:** Gerenciamento local com Services

### **Páginas e Funcionalidades:**
1. **Login/Register** - Autenticação de usuários
2. **Estoque** - Visualização e gestão do estoque atual
3. **Funcionários** - Gestão de recursos humanos (exibe data de cadastro)
4. **Movimentação** - Controle de entradas e saídas
5. **Financeiro** - Relatórios e transações financeiras

### **Estrutura de Componentes:**
```
src/app/
├── components/
│   ├── login/
│   ├── register/
│   └── estoque/
├── Funcionarios/
├── Movimentacao/
├── Financeiro/
├── services/
│   ├── auth.service.ts
│   ├── funcionario.service.ts
│   └── produto.service.ts
├── guards/
│   └── auth.guard.ts
└── models/
    ├── usuario.model.ts
    └── funcionario.model.ts
```

## 🛡️ Segurança

### **Autenticação e Autorização:**
- **JWT Tokens:** Gerados pelo Usuario Service
- **BCrypt:** Hash seguro de senhas
- **Guards:** Proteção de rotas no Angular
- **Roles:** Sistema de permissões (Admin/User)
- **CORS:** Configurado no API Gateway

### **Proteção de Dados:**
- **SQL Injection:** Proteção via Entity Framework
- **HTTPS:** Configurável para produção
- **Environment Variables:** Senhas e strings de conexão seguras

## 🗃️ Bancos de Dados

### **Arquitetura Multi-Database:**

1. **UsuariosDB** - Usuario Service
   ```sql
   Tables: Usuarios
   - Dados de autenticação e perfis
   ```

2. **ProdutosDB** - Produto Service  
   ```sql
   Tables: Produtos, Estoque
   - Catálogo de produtos e inventário
   ```

3. **EstoqueDB** - Shared Database
   ```sql
   Tables: Funcionarios, Movimentacao, Transacoes
   - Dados operacionais compartilhados
   ```

## 🔧 Infraestrutura

### **Containerização com Docker:**
- **Multi-stage builds** para otimização de imagens
- **Health checks** para SQL Server
- **Volumes persistentes** para dados
- **Network isolada** para comunicação segura

### **Cache e Performance:**
- **Redis:** Cache distribuído entre serviços
- **Connection Pooling:** Otimização de conexões DB
- **Lazy Loading:** Carregamento sob demanda

## 🚀 Como Executar

### **Pré-requisitos:**
```bash
- Docker & Docker Compose
- .NET 8 SDK (para desenvolvimento local)
- Node.js 18+ (para desenvolvimento local)
```

### **Execução Completa:**
```bash
# Na raiz do projeto
docker-compose up --build

# Rebuild sem cache (se necessário)
docker-compose build --no-cache
docker-compose up
```

### **URLs dos Serviços:**
```
Frontend:           http://localhost:4200
API Gateway:        http://localhost:5000
Usuario Service:    http://localhost:5002
Produto Service:    http://localhost:5001  
Funcionario Service: http://localhost:5004
Movimentacao Service: http://localhost:5005
Financeiro Service: http://localhost:5003
SQL Server:         localhost:1433
Redis:              localhost:6379
```

### **Desenvolvimento Local:**
```bash
# Backend (cada serviço individualmente)
cd backend/UsuarioService/UsuarioService && dotnet run
cd backend/ProdutoService && dotnet run
cd backend/ApiGateway/ApiGateway && dotnet run

# Frontend
cd frontend/estoque-app && npm install && npm start
```

## 📊 Benefícios da Arquitetura

### **Escalabilidade:**
- **Horizontal:** Cada serviço pode ter múltiplas instâncias
- **Vertical:** Recursos dedicados por responsabilidade
- **Load Balancing:** Distribuição automática de carga

### **Manutenibilidade:**
- **Separação de responsabilidades:** Cada serviço tem propósito único
- **Deploy independente:** Atualizações sem afetar outros serviços
- **Tecnologias específicas:** Cada serviço pode usar stack otimizada

### **Confiabilidade:**
- **Isolamento de falhas:** Problemas em um serviço não afetam outros
- **Health checks:** Monitoramento automático de saúde
- **Circuit breakers:** Preparado para implementação de resiliência

## 🔮 Próximos Passos

### **Curto Prazo:**
- [ ] Implementar Swagger/OpenAPI em todos os serviços
- [ ] Adicionar logs estruturados (Serilog)
- [ ] Configurar environment de produção

### **Médio Prazo:**
- [ ] Service Discovery (Consul/Eureka)
- [ ] Circuit Breaker Pattern (Polly)
- [ ] Event-Driven Architecture (RabbitMQ/Apache Kafka)
- [ ] Distributed Tracing (OpenTelemetry)

### **Longo Prazo:**
- [ ] Kubernetes deployment
- [ ] Monitoring completo (Prometheus + Grafana)
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] API Versioning strategy

## 📈 Métricas e Monitoramento

### **Health Checks Implementados:**
- SQL Server health check com retry policy
- Cada serviço expõe endpoint `/health`
- Docker health checks para auto-recovery

### **Logs e Auditoria:**
- Logs estruturados em cada serviço
- Auditoria de login e alterações críticas
- Rastreamento de performance

---

**Versão da Arquitetura:** 2.0  
**Última Atualização:** Julho 2025  
**Status:** Produção Ready
