![Capa do projeto](readmeIMG/Capa.png)

<br/>
<br/>

Este é o meu portfólio pessoal, desenvolvido como projeto full stack da minha formação em desenvolvimento web. Ele começou como um site estático e evoluiu para uma aplicação completa: o front-end consome uma API própria para exibir os projetos e receber mensagens de contato, e um painel administrativo protegido por login me permite gerenciar todo o conteúdo sem tocar no código.

<br/>
<br/>

![Design final do projeto](readmeIMG/Designer.png)

<br/>
<br/>

---

<br/>
<br/>

## 🌐 Acesse o Projeto

Você pode visualizar o projeto diretamente pelo navegador:

👉 **https://kelvimarcos.github.io/DevPortfolio/**

- API: https://devportfolio-tdf4.onrender.com
- Painel administrativo: acesso restrito por login


<br/>
<br/>

---

<br/>
<br/>

## 💡 Insight

Em vez de editar HTML e fazer novo deploy toda vez que quero trocar um projeto ou revisar um texto, eu entro no meu próprio painel, altero e o site reflete na hora. Além de resolver um problema real meu, o projeto demonstra o ciclo completo de uma aplicação web — interface, API, banco de dados, autenticação e deploy.



<br/>
<br/>

---

<br/>
<br/>



## 🎨 Design


- O projeto começou na criação da minha própria identidade visual e reflete perfeitamente o que quero transmitir.
- Tema escuro com destaque em laranja, tipografia Inter e hierarquia visual forte e fonte moderna.
- Hero com animação de entrada e faixa de tecnologias em movimento (marquee)
- Animações de revelação ao rolar a página
- Painel administrativo com identidade visual própria, alinhada à marca do site
- Layout responsivo para desktop, tablet e mobile



<br/>
<br/>

---

<br/>
<br/>




## 💻 Front-end

- HTML, CSS e JavaScript puro — sem frameworks
- Cards de projeto renderizados dinamicamente a partir da API (`fetch`)
- Formulário de contato com validação de campos e feedback visual de envio, erro e sucesso
- Cache local dos projetos (`localStorage`) para carregamento instantâneo em visitas repetidas
- Publicado no GitHub Pages



<br/>
<br/>

---

<br/>
<br/>


## ⚙️ Back-end

- API REST em Node.js com Express, organizada em rotas, controllers e middlewares
- PostgreSQL com Prisma (ORM, migrations e seed)
- Autenticação de administrador com bcryptjs e sessão em cookie persistida no banco
- Rotas privadas protegidas por middleware de autenticação
- Publicado no Render via Docker, com banco no Supabase


<br/>
<br/>

---

<br/>
<br/>


## 🚀 Funcionalidades

- Listagem dinâmica de projetos vinda do banco de dados
- Formulário de contato que grava as mensagens (nome, email, telefone, canal de retorno)
- Login de administrador com sessão segura
- Painel para criar, editar e excluir projetos
- Visualização e exclusão das mensagens recebidas, com vínculo ao projeto de interesse
- Menu mobile animado e navegação suave entre seções



<br/>
<br/>

---

<br/>
<br/>


## 🛠️ Tecnologias Utilizadas

HTML5 → Estrutura semântica
CSS3 → Estilização moderna (grid, flexbox, animações, responsividade)
JavaScript → Interatividade e consumo da API
Node.js + Express → API REST
PostgreSQL + Prisma → Banco de dados e ORM
bcryptjs + express-session → Autenticação e sessão
Docker → Container do back-end
GitHub Pages, Render e Supabase → Deploy


<br/>
<br/>

---

<br/>
<br/>


## 📖 O que aprendi com este projeto

Construir uma API REST do zero e organizá-la em camadas
Modelar entidades relacionadas e trabalhar com migrations
Implementar autenticação com hash de senha e sessão em cookie
Lidar com CORS e cookies entre domínios diferentes (front e API em hospedagens separadas)
Fazer deploy de front-end estático e de container Docker
Integrar front-end e back-end de forma incremental, sem quebrar o que já funcionava



<br/>
<br/>

---

<br/>
<br/>


## ▶️ Rodando localmente

Pré-requisitos: Node.js e PostgreSQL instalados.


<br/>
<br/>

---

<br/>
<br/>


## ⚠️ Observações Importantes

O deploy da API foi feito no Render.


<br/>
<br/>

---

<br/>
<br/>


## 📌 Próximos Passos

Upload de imagem direto pelo painel (ex: Supabase Storage)
Notificação por email quando uma nova mensagem chegar
Monitoramento da API para evitar a hibernação do plano gratuito
Filtro de projetos por categoria na página inicial

<br/>
<br/>

---

<br/>
<br/>


## 🧭 Usabilidade

O projeto nasceu no wireframe abaixo, onde defini a estrutura das seções antes de partir para o design e o código:

![Wireframe do projeto](readmeIMG/Wireframe.png)


<br/>
<br/>

---

<br/>
<br/>


### Interação de chat

Um detalhe de usabilidade que gosto de destacar: na seção de contato, simulei uma conversa real de mensageiro. Primeiro aparece o indicador de "digitando..." e, em seguida, a mensagem chega — como se eu estivesse falando com o visitante naquele momento. É um toque pequeno, mas aproxima a experiência de algo humano e convida a pessoa a iniciar a conversa.

| Digitando... | Mensagem recebida |
|---|---|
| ![Indicador de digitando](readmeIMG/mensagem2.png) | ![Mensagem recebida](readmeIMG/mensagem1.png) |
