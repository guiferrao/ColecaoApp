# 📦 Coleção App

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC292B?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Aplicação Fullstack robusta para gerenciamento estruturado de coleções e itens, implementando autenticação stateless via JWT, arquitetura desacoplada em microsserviços e conteinerização completa com Docker Compose.

---

## 📑 Sumário

- [Visão Geral e Arquitetura](#-visão-geral-e-arquitetura)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Estrutura do Repositório](#-estrutura-do-repositório)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Como Executar Localmente](#-como-executar-localmente)
  - [Pré-requisitos](#pré-requisitos)
  - [Execução com Docker Compose](#execução-com-docker-compose)
  - [Acesso às Aplicações](#acesso-às-aplicações)
- [Endpoints da API](#-endpoints-da-api)
- [Licença](#-licença)

---

## 🏛 Visão Geral e Arquitetura

O ecossistema é totalmente orquestrado via Docker Compose, isolando as camadas de apresentação, processamento e persistência:

```text
                                [ Usuário / Navegador ]
                                           │
                                           │ (HTTP: Porta 3000)
                                           ▼
                                ┌──────────────────────┐
                                │     colecao-web      │
                                │  (React / Vite SPA)  │
                                └──────────┬───────────┘
                                           │
                                           │ (HTTP API Calls: Porta 8080)
                                           ▼
                                ┌──────────────────────┐
                                │     colecao-api      │
                                │ (ASP.NET Core / .NET)│
                                └──────────┬───────────┘
                                           │
                                           │ (TCP: Porta 1433 / EF Core)
                                           ▼
                                ┌──────────────────────┐
                                │     sqlserver-db     │
                                │  (SQL Server 2022)   │
                                └──────────────────────┘
```

1. **Frontend (SPA):** Interface desenvolvida em React + TypeScript com Vite e Tailwind/CSS, executando no navegador do cliente (CSR) e consumindo os endpoints da API via Axios.
2. **Backend (REST API):** API construída em ASP.NET Core (.NET 8), executando sobre o servidor Kestrel com injeção de dependência nativa, autenticação JWT e validação de requisições.
3. **Banco de Dados Relacional:** Microsoft SQL Server 2022 rodando em container dedicado, com volume persistente para segurança dos dados.

---

## 🛠 Tecnologias Utilizadas

### **Backend**
- **C# / .NET 8** — Plataforma backend moderna e de alta performance.
- **ASP.NET Core Web API** — Construção de controllers e rotas RESTful.
- **Entity Framework Core** — ORM para mapeamento de entidades, queries LINQ e migrações.
- **JWT (JSON Web Tokens) & BCrypt** — Autenticação stateless segura e hashing de senhas.
- **Swagger / OpenAPI** — Documentação e teste interativo dos endpoints.

### **Frontend**
- **React** com **TypeScript** — Interface declarativa, reativa e tipada.
- **Vite** — Ferramenta de build rápida e moderna.
- **Axios** — Gerenciamento de requisições HTTP e interceptors para anexar tokens JWT.
- **React Router** — Controle de rotas protegidas e navegação SPA.

### **Infraestrutura & DevOps**
- **Docker & Docker Compose** — Padronização de ambiente e orquestração dos serviços (`colecao-web`, `colecao-api`, `sqlserver`).
- **Microsoft SQL Server 2022 Linux** — SGBD relacional conteinerizado.

---

## ✨ Funcionalidades Principais

- [x] **Autenticação & Autorização:** Registro de usuários, login seguro e geração de tokens JWT.
- [x] **Gestão de Coleções e Itens:** Operações completas de CRUD (Criação, Leitura, Atualização e Exclusão) com paginação e filtros.
- [x] **Segurança:** Hashing de senhas com salt, proteção contra SQL Injection via ORM e políticas de CORS configuráveis.
- [x] **Persistência Confiável:** Volumes Docker mapeados para manter os dados do SQL Server intactos entre reinicializações.
- [x] **Deploy Unificado:** Subida de todo o ecossistema com um único comando via Docker Compose.

---

## 📂 Estrutura do Repositório

```text
Colecao-App/
├── src/                                  # Backend (.NET 8 - Clean Architecture)
│   ├── ColecaoApp.Api/                   # Controllers, Middlewares, DI e Program.cs
│   ├── ColecaoApp.Application/           # Casos de uso, DTOs e Interfaces de Serviços
│   ├── ColecaoApp.Domain/                # Entidades de Domínio e Regras de Negócio
│   └── ColecaoApp.Infrastructure/        # EF Core, DbContext, Migrations e Repositórios
│
├── frontend/                             # Frontend (React + TypeScript + Vite)
│   ├── public/                           # Arquivos estáticos públicos
│   ├── src/
│   │   ├── assets/                       # Ícones e recursos visuais
│   │   ├── components/                   # Componentes reutilizáveis de UI
│   │   ├── services/                     # Configuração do Axios e chamadas de API
│   │   ├── types/                        # Interfaces e definições de tipos TypeScript
│   │   ├── App.css                       # Estilos globais da aplicação
│   │   ├── App.tsx                       # Componente principal / Roteamento
│   │   ├── index.css                     # Estilização base
│   │   └── main.tsx                      # Ponto de entrada do React
│   ├── Dockerfile                        # Multi-stage build do Frontend
│   ├── nginx.conf                        # Configuração do Nginx para servir a SPA
│   ├── package.json                      # Dependências e scripts npm
│   └── vite.config.ts                    # Configuração de build do Vite
│
├── .dockerignore                         # Arquivos ignorados no build Docker
├── .env.example                          # Modelo das variáveis de ambiente
├── docker-compose.yml                    # Orquestrador dos containers (App, API, DB)
└── README.md                             # Documentação do projeto
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
# Ambiente de execução do ASP.NET Core
ASPNETCORE_ENVIRONMENT=Development

# Chave de assinatura dos tokens JWT (mínimo 32 caracteres)
JWT_SECRET=SuaSenhaDe32Caracteres

# Senha do administrador (SA) do SQL Server
MSSQL_SA_PASSWORD=SuaSenhaDoBancoDeDados
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e ativo (com suporte a WSL 2 no Windows).
- [Git](https://git-scm.com/) instalado.

---

### Execução com Docker Compose

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/guiferrao/ColecaoApp.git
   cd Colecao-App
   ```

2. **Configure o arquivo `.env`:**
   ```bash
   cp .env.example .env
   # Preencha suas credenciais no arquivo .env gerado
   ```

3. **Inicie os serviços:**
   ```bash
   docker compose up -d --build
   ```

4. **Para verificar os logs em tempo real:**
   ```bash
   docker compose logs -f
   ```

5. **Para encerrar os containers:**
   ```bash
   docker compose down
   ```

---

### Acesso às Aplicações

| Serviço | Endereço Local | Descrição |
| :--- | :--- | :--- |
| **Frontend (React)** | [http://localhost:3000](http://localhost:3000) | Interface web do usuário |
| **Backend (API)** | [http://localhost:8080](http://localhost:8080) | Servidor Kestrel ASP.NET Core |
| **Swagger UI** | [http://localhost:8080/swagger](http://localhost:8080/swagger) | Documentação interativa dos endpoints |
| **SQL Server** | `localhost:1433` | Acesso via SSMS / Azure Data Studio |

---

## 📡 Endpoints da API

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Criação de nova conta de usuário | Pública |
| `POST` | `/api/auth/login` | Autenticação e retorno do token JWT | Pública |
| `GET` | `/api/items` | Listagem de todos os itens cadastrados | Bearer JWT |
| `GET` | `/api/items/{id}` | Busca de item por identificador único | Bearer JWT |
| `POST` | `/api/items` | Cadastro de um novo item | Bearer JWT |
| `PUT` | `/api/items/{id}` | Atualização dos dados de um item | Bearer JWT |
| `DELETE` | `/api/items/{id}` | Exclusão de um item da coleção | Bearer JWT |

---

## 📄 Licença

Este projeto é distribuído sob a licença [MIT](LICENSE).

---

<p align="center">
  Desenvolvido por <strong>Guilherme de Oliveira Ferrão</strong> 🚀
</p>
