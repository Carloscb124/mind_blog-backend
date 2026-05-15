# Mind Blog — Backend

API REST desenvolvida com **Node.js**, **Express**, **TypeScript** e **MySQL** para o case de estágio da Mind Group.

## 🚀 Tecnologias

- Node.js + Express
- TypeScript
- MySQL2
- JWT (autenticação)
- Bcrypt (hash de senhas)
- Multer (upload de imagens)

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8+

## ⚙️ Configuração

**1. Clone o repositório e instale as dependências:**
```bash
npm install
```

**2. Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```
Edite o `.env` com suas credenciais do MySQL e um JWT secret seguro.

**3. Importe o banco de dados:**
```bash
mysql -u root -p < dump.sql
```

**4. Inicie o servidor em modo desenvolvimento:**
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3333`.

---

## 📡 Endpoints

### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Cadastra novo usuário | ❌ |
| POST | `/auth/login` | Realiza login | ❌ |
| GET | `/auth/me` | Retorna dados do usuário logado | ✅ |

### Artigos

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/articles` | Lista todos os artigos | ❌ |
| GET | `/articles/:id` | Busca artigo por ID | ❌ |
| POST | `/articles` | Cria novo artigo | ✅ |
| PUT | `/articles/:id` | Edita artigo (somente autor) | ✅ |
| DELETE | `/articles/:id` | Remove artigo (somente autor) | ✅ |

> **Auth ✅**: Envie o token no header: `Authorization: Bearer <token>`

### Upload de imagens

Para criar/editar artigos com banner, envie `multipart/form-data` com o campo `banner`.
Se precisar criar a pasta uploads, crie manualmente na raiz do projeto para evitar erros de upload.

---

## 🗂️ Estrutura do projeto

```
src/
├── config/
│   └── database.ts       # Pool de conexão MySQL
├── controllers/
│   ├── authController.ts # Register, login, me
│   └── articleController.ts # CRUD de artigos
├── middlewares/
│   ├── auth.ts           # Validação JWT
│   └── upload.ts         # Configuração Multer
├── routes/
│   ├── auth.ts
│   └── articles.ts
└── server.ts             # Entrada da aplicação
uploads/                  # Imagens salvas localmente
dump.sql                  # Script SQL do banco
```

---

## 👤 Usuário de teste (já no dump)

```
Email: admin@mindblog.com
Senha: password
```
