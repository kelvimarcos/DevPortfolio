# Diagnóstico de Qualidade — DevPortfolio

Análise feita antes da refatoração da AV1, sobre o commit `43b8819` da branch `main`.
As referências de linha apontam para essa versão. As correções foram feitas na branch `refactor/limpeza-codigo`.

<br/>

## Visão geral do projeto

| Parte | Tecnologia | Arquivos principais |
|---|---|---|
| Front-end (site) | HTML, CSS e JavaScript puro | `front-end/index.html`, `front-end/js/script.js`, `front-end/js/config.js` |
| Painel administrativo | HTML, CSS e JavaScript puro | `front-end/admin/admin.js`, `login.html`, `dashboard.html` |
| Back-end | Node.js, Express, Prisma, PostgreSQL | `backend/src/app.js`, `controllers/`, `routes/`, `middlewares/` |
| Deploy | GitHub Pages (front), Render + Docker (API), Supabase (banco) | `.github/workflows/deploy.yml`, `backend/Dockerfile` |

<br/>

## Code smells encontrados

### 1. Função com responsabilidades demais

- **Arquivo:** `front-end/admin/admin.js` (linhas 74–131)
- **Trecho:** `carregarProjetos()`
- **Problema:** em 57 linhas, a função busca os projetos na API, controla os estados de carregando/vazio/erro, monta cada célula da tabela e ainda define, dentro do loop, o que os botões **Editar** (preenche 7 campos do formulário) e **Excluir** fazem.
- **Impacto:** difícil de ler e de alterar; mudar o formulário de edição obriga a mexer na função de listagem.
- **Requisito da AV1:** extrair função.
- **Correção:** commit `fc348a9` — extraídas `criarLinhaProjeto(projeto)` e `preencherFormularioProjeto(projeto)`.

### 2. Duplicação no tratamento de "registro não encontrado"

- **Arquivos:** `backend/src/controllers/projetos.controller.js` (linhas 56 e 66) e `backend/src/controllers/mensagens.controller.js` (linha 50)
- **Trecho:** `if (err.code === 'P2025') return res.status(404)...`
- **Problema:** a mesma verificação foi copiada 3 vezes, usando o código mágico `P2025` do Prisma sem explicar o que ele significa.
- **Impacto:** quem lê precisa conhecer o código do Prisma de cor; qualquer mudança exige editar vários arquivos.
- **Requisito da AV1:** eliminar duplicação.
- **Correção:** commit `43b2d56` — criado `backend/src/utils/prismaErrors.js` com a constante nomeada e a função `isRegistroNaoEncontrado(err)`.

### 3. Tratamento de erro sem contexto e com vazamento de detalhes internos

- **Arquivo:** `backend/src/middlewares/errorHandler.js` (linhas 2–3)
- **Trecho:** `console.error(err)` e `json({ error: err.message })`
- **Problema:** o log não informa método, rota nem horário, e a mensagem original do erro é devolvida ao cliente mesmo em erros 500.
- **Impacto:** difícil investigar falhas nos logs do Render. O vazamento foi confirmado em produção: `GET /api/projetos` devolveu ao público a mensagem interna do Prisma, incluindo o usuário/tenant do banco.
- **Requisito da AV1:** tratamento de erro com logging adequado.
- **Correção:** commit `52cc44a` — o log registra data/hora, método, rota e status; respostas 5xx devolvem apenas `"Erro interno do servidor."`, e respostas 4xx continuam com a mensagem original.

### 4. Nomes vagos e números mágicos

- **Arquivo:** `front-end/js/script.js` (linhas 55, 60, 70 e 109–115)
- **Trecho:** `t1`, `t2`, `t`, `delay`, `index` sem uso e os valores `550`, `2000`, `4`, `140`
- **Problema:** os nomes não dizem o que guardam; `delay` na verdade é uma posição (0 a 3), não um tempo; o comentário "500ms de delay" estava desatualizado em relação ao valor real (550).
- **Impacto:** é preciso ler os comentários (um deles incorreto) para entender o código.
- **Requisito da AV1:** renomear variáveis/funções vagas.
- **Correção:** commit `7241c20` — nomes descritivos (`showBubbleTimeout`, `staggerPosition`...) e constantes nomeadas para os tempos.

### 5. Credencial padrão fraca no seed

- **Arquivo:** `backend/prisma/seed.js` (linhas 15–16)
- **Trecho:** `process.env.ADMIN_PASSWORD || 'trocar senha'`
- **Problema:** se a variável `ADMIN_PASSWORD` não estiver definida, o administrador é criado com uma senha conhecida, e o e-mail do administrador fica fixo no código e no `.env.example`.
- **Impacto:** risco de existir um administrador com senha previsível.
- **Status:** não corrigido nesta entrega — envolve credenciais e dados de produção, e fica registrado como próximo passo.

<br/>

## Complexidade ciclomática

Função escolhida: `carregarProjetos()` em `front-end/admin/admin.js`, por ser a função mais crítica do painel.
Contagem manual pelo método de McCabe (pontos de decisão + 1), incluindo os callbacks internos.

**Antes da refatoração**

| Ponto de decisão | Linha | +1 |
|---|---|---|
| `catch` | 128 | 1 |
| `if (!projetos.length)` | 78 | 1 |
| `projeto.linkProjeto \|\| ''` | 106 | 1 |
| `projeto.linkCodigo \|\| ''` | 107 | 1 |
| `projeto.imagemUrl \|\| ''` | 108 | 1 |
| `if (!confirm(...))` | 119 | 1 |

**CC = 6 + 1 = 7**, tudo concentrado em uma única função.

**Depois da refatoração (commit `fc348a9`)**

| Função | Decisões | CC |
|---|---|---|
| `carregarProjetos()` | `catch`, `if (!projetos.length)` | 3 |
| `criarLinhaProjeto(projeto)` | `if (!confirm(...))` | 2 |
| `preencherFormularioProjeto(projeto)` | três `\|\|` | 4 |

A complexidade total é parecida, mas agora está distribuída em funções com uma responsabilidade cada, e a função principal caiu de 57 para 14 linhas.

<br/>

## Git e organização do repositório

- Commits com mensagens vagas (`atualização`, `ajustes front`, `ajuste no header`), que não dizem o que mudou.
- Todo o desenvolvimento foi feito direto na `main`, sem branches nem Pull Requests.
- Sem `.gitattributes`: o Git emite avisos de conversão LF/CRLF no Windows.
- O `.env` com as credenciais reais **não** está versionado nem aparece no histórico (ponto positivo).

<br/>

## Documentação

- `README.md`: a seção "Rodando localmente" contém apenas os pré-requisitos, sem os passos.
- `README.md`: a URL da API citada (`devportfolio-tdf4`) é diferente da URL usada pelo front-end publicado em `front-end/js/config.js` (`devportfolio-4uju`).
- `backend/README.md`: o passo a passo manda executar `cd server`, mas a pasta se chama `backend`.

<br/>

## Fora do escopo desta entrega

Problemas reais encontrados, mas deixados para depois para manter as mudanças pequenas e seguras:

- **Login do painel** (`front-end/admin/admin.js`, linhas 43–46): qualquer erro — inclusive API fora do ar — é exibido como "Email ou senha inválidos.".
- **Ações sem tratamento de erro** (`admin.js`, botões Excluir e Sair): `await apiFetch(...)` sem `try/catch`; uma falha não mostra aviso ao usuário.
- **API de produção**: o front-end publicado aponta para `devportfolio-4uju`, cujo banco configurado não existe, e responde erro 500 em `/api/projetos`. A correção depende da configuração no Render.
- **Credencial padrão no seed** (smell 5).
