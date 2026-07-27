const API_BASE_URL = window.API_BASE_URL;

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);
    if (!res.ok) {
        const error = new Error((data && data.error) || 'Erro inesperado.');
        error.status = res.status;
        throw error;
    }
    return data;
}

// Página de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const feedbackEl = document.getElementById('loginFeedback');

    apiFetch('/api/auth/me')
        .then(() => { window.location.href = 'dashboard.html'; })
        .catch(() => {});

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedbackEl.textContent = '';

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, senha }),
            });
            window.location.href = 'dashboard.html';
        } catch (err) {
            feedbackEl.textContent = 'Email ou senha inválidos.';
            feedbackEl.className = 'admin-feedback admin-feedback-error';
        }
    });
}

// Dashboard
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    const adminEmailEl = document.getElementById('adminEmail');

    const projetoForm = document.getElementById('projetoForm');
    const projetoIdInput = document.getElementById('projetoId');
    const projetoSubmitBtn = document.getElementById('projetoSubmitBtn');
    const cancelarEdicaoBtn = document.getElementById('cancelarEdicaoBtn');
    const projetoFormFeedback = document.getElementById('projetoFormFeedback');
    const projetosTableBody = document.getElementById('projetosTableBody');
    const mensagensTableBody = document.getElementById('mensagensTableBody');

    function formatarData(iso) {
        return new Date(iso).toLocaleString('pt-BR');
    }

    function resetarFormularioProjeto() {
        projetoForm.reset();
        projetoIdInput.value = '';
        projetoSubmitBtn.textContent = 'Criar projeto';
        cancelarEdicaoBtn.hidden = true;
    }

    async function carregarProjetos() {
        projetosTableBody.innerHTML = '<tr><td colspan="5">Carregando...</td></tr>';
        try {
            const projetos = await apiFetch('/api/projetos');
            if (!projetos.length) {
                projetosTableBody.innerHTML = '<tr><td colspan="5">Nenhum projeto cadastrado.</td></tr>';
                return;
            }
            projetosTableBody.innerHTML = '';
            projetos.forEach((projeto) => {
                const tr = document.createElement('tr');

                const tdTitulo = document.createElement('td');
                tdTitulo.textContent = projeto.titulo;
                const tdCategoria = document.createElement('td');
                tdCategoria.textContent = projeto.categoria;
                const tdAno = document.createElement('td');
                tdAno.textContent = projeto.ano;
                const tdTecnologias = document.createElement('td');
                tdTecnologias.textContent = projeto.tecnologias;

                const tdAcoes = document.createElement('td');
                const editarBtn = document.createElement('button');
                editarBtn.type = 'button';
                editarBtn.className = 'admin-btn admin-btn-small admin-btn-outline';
                editarBtn.textContent = 'Editar';
                editarBtn.addEventListener('click', () => {
                    projetoIdInput.value = projeto.id;
                    document.getElementById('titulo').value = projeto.titulo;
                    document.getElementById('categoria').value = projeto.categoria;
                    document.getElementById('ano').value = projeto.ano;
                    document.getElementById('tecnologias').value = projeto.tecnologias;
                    document.getElementById('linkProjeto').value = projeto.linkProjeto || '';
                    document.getElementById('linkCodigo').value = projeto.linkCodigo || '';
                    document.getElementById('imagemUrl').value = projeto.imagemUrl || '';
                    projetoSubmitBtn.textContent = 'Salvar alterações';
                    cancelarEdicaoBtn.hidden = false;
                    projetoForm.scrollIntoView({ behavior: 'smooth' });
                });

                const excluirBtn = document.createElement('button');
                excluirBtn.type = 'button';
                excluirBtn.className = 'admin-btn admin-btn-small admin-btn-danger';
                excluirBtn.textContent = 'Excluir';
                excluirBtn.addEventListener('click', async () => {
                    if (!confirm(`Excluir o projeto "${projeto.titulo}"?`)) return;
                    await apiFetch(`/api/projetos/${projeto.id}`, { method: 'DELETE' });
                    carregarProjetos();
                });

                tdAcoes.append(editarBtn, excluirBtn);
                tr.append(tdTitulo, tdCategoria, tdAno, tdTecnologias, tdAcoes);
                projetosTableBody.appendChild(tr);
            });
        } catch (err) {
            projetosTableBody.innerHTML = '<tr><td colspan="5">Não foi possível carregar os projetos.</td></tr>';
        }
    }

    async function carregarMensagens() {
        mensagensTableBody.innerHTML = '<tr><td colspan="8">Carregando...</td></tr>';
        try {
            const mensagens = await apiFetch('/api/mensagens');
            if (!mensagens.length) {
                mensagensTableBody.innerHTML = '<tr><td colspan="8">Nenhuma mensagem recebida ainda.</td></tr>';
                return;
            }
            mensagensTableBody.innerHTML = '';
            mensagens.forEach((mensagem) => {
                const tr = document.createElement('tr');

                const tdNome = document.createElement('td');
                tdNome.textContent = mensagem.nome;
                const tdEmail = document.createElement('td');
                tdEmail.textContent = mensagem.email;
                const tdTelefone = document.createElement('td');
                tdTelefone.textContent = mensagem.telefone;
                const tdCanal = document.createElement('td');
                tdCanal.textContent = mensagem.canalEnvio;
                const tdMensagem = document.createElement('td');
                tdMensagem.textContent = mensagem.mensagem;
                const tdProjeto = document.createElement('td');
                tdProjeto.textContent = mensagem.projeto ? mensagem.projeto.titulo : '—';
                const tdData = document.createElement('td');
                tdData.textContent = formatarData(mensagem.createdAt);

                const tdAcoes = document.createElement('td');
                const excluirBtn = document.createElement('button');
                excluirBtn.type = 'button';
                excluirBtn.className = 'admin-btn admin-btn-small admin-btn-danger';
                excluirBtn.textContent = 'Excluir';
                excluirBtn.addEventListener('click', async () => {
                    if (!confirm('Excluir esta mensagem?')) return;
                    await apiFetch(`/api/mensagens/${mensagem.id}`, { method: 'DELETE' });
                    carregarMensagens();
                });
                tdAcoes.appendChild(excluirBtn);

                tr.append(tdNome, tdEmail, tdTelefone, tdCanal, tdMensagem, tdProjeto, tdData, tdAcoes);
                mensagensTableBody.appendChild(tr);
            });
        } catch (err) {
            mensagensTableBody.innerHTML = '<tr><td colspan="8">Não foi possível carregar as mensagens.</td></tr>';
        }
    }

    projetoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        projetoFormFeedback.textContent = '';

        const payload = {
            titulo: document.getElementById('titulo').value,
            categoria: document.getElementById('categoria').value,
            ano: Number(document.getElementById('ano').value),
            tecnologias: document.getElementById('tecnologias').value,
            linkProjeto: document.getElementById('linkProjeto').value || null,
            linkCodigo: document.getElementById('linkCodigo').value || null,
            imagemUrl: document.getElementById('imagemUrl').value || null,
        };

        try {
            if (projetoIdInput.value) {
                await apiFetch(`/api/projetos/${projetoIdInput.value}`, {
                    method: 'PUT',
                    body: JSON.stringify(payload),
                });
            } else {
                await apiFetch('/api/projetos', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                });
            }
            resetarFormularioProjeto();
            carregarProjetos();
        } catch (err) {
            projetoFormFeedback.textContent = err.message;
            projetoFormFeedback.className = 'admin-feedback admin-feedback-error';
        }
    });

    cancelarEdicaoBtn.addEventListener('click', resetarFormularioProjeto);

    logoutBtn.addEventListener('click', async () => {
        await apiFetch('/api/auth/logout', { method: 'POST' });
        window.location.href = 'login.html';
    });

    apiFetch('/api/auth/me')
        .then((admin) => {
            adminEmailEl.textContent = admin.email;
            carregarProjetos();
            carregarMensagens();
        })
        .catch(() => {
            window.location.href = 'login.html';
        });
}
