# Back-end do portfolio

API REST em Express que da suporte ao portfolio (`../index.html`), com persistencia em PostgreSQL via Prisma e autenticacao de administrador por sessao em cookie.

## Entidades

- **Admin** - usuario unico, dono do portfolio. `id, email, senhaHash, createdAt`.
- **Projeto** - projetos exibidos no portfolio. `id, titulo, categoria, ano, tecnologias, linkProjeto, linkCodigo, imagemUrl, createdAt, updatedAt`.
- **Mensagem** - mensagens enviadas pelo formulario de contato. `id, nome, email, canalEnvio, mensagem, projetoId (FK opcional), createdAt`.

## Endpoints

| Metodo | Rota | Acesso | Descricao |
|---|---|---|---|
| POST | `/api/auth/register` | publico (uso unico) | Cria o administrador. |
| POST | `/api/auth/login` | publico | Autentica e cria a sessao. |
| POST | `/api/auth/logout` | publico | Encerra a sessao. |
| GET | `/api/auth/me` | privada | Dados do admin logado. |
| GET | `/api/projetos` | publico | Lista projetos. |
| GET | `/api/projetos/:id` | publico | Detalhe de um projeto. |
| POST | `/api/projetos` | privada | Cria projeto. |
| PUT | `/api/projetos/:id` | privada | Atualiza projeto. |
| DELETE | `/api/projetos/:id` | privada | Remove projeto. |
| POST | `/api/mensagens` | publico | Registra mensagem de contato. |
| GET | `/api/mensagens` | privada | Lista mensagens recebidas. |
| DELETE | `/api/mensagens/:id` | privada | Remove mensagem. |

## Variaveis de ambiente

Ver `.env.example`. Copie para `.env` e preencha com os valores reais (esse arquivo nao vai pro Git).

## Como rodar localmente

Pre-requisito: PostgreSQL instalado, com um banco criado.

```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run seed
npm run dev
```

A API sobe em `http://localhost:3333`.
