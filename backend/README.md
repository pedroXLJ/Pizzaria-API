# Projeto Pizzaria - Backend Simples com Spring Boot

Este é um projeto didático de uma API REST desenvolvida com **Spring Boot**, focada no cadastro de pizzas. A aplicação se comunica com um banco de dados MySQL e permite realizar operações básicas via HTTP.

---

## 🔧 Tecnologias

- Java 17
- Spring Boot
- Maven
- Docker + Docker Compose
- MySQL

---

## 🚀 Como subir o projeto com Docker Compose

### 1. Build do projeto

Certifique-se de que o projeto esteja compilado:

```bash
./mvnw clean package
```

### 2. Subir os containers

```bash
docker-compose up -d
```

> Isso irá subir o banco de dados MySQL e o backend na porta 8080.

### 3. Verificar se a API está rodando

Acesse: [http://localhost:8080/pizza](http://localhost:8080/pizza)  caso use uma VM a porta será 8099

---

## 📁 Endpoints disponíveis

- `GET /pizza`: lista todas as pizzas cadastradas
- `POST /pizza`: cadastra uma nova pizza
- `PUT /pizza/{id}`: atualiza uma pizza existente
- `DELETE /pizza/{id}`: remove uma pizza por ID

> Obs: não há autenticação ou segurança implementadas nesta versão. Todos os endpoints estão abertos para testes.

---

## 🛠️ Problemas comuns e soluções

### ❌ Docker Compose travou ou container ficou corrompido

Execute:

```bash
docker-compose down
```

### ❌ Limpar tudo e recomeçar

```bash
docker system prune -af --volumes
```

> ⚠️ Isso removerá **todas as imagens, containers e volumes** não usados. Use com cuidado!

---

## 🧪 Testes com cURL

### Linux/macOS

```bash
curl http://localhost:8080/pizza
```

### Windows PowerShell

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/pizza"
```

---

## 👨‍🏫 Objetivo

Este projeto foi elaborado com fins **educacionais**, para demonstrar a construção de uma API REST simples com Java e Spring Boot, utilizando um banco de dados relacional e boas práticas na estrutura do projeto.

