//  Rolagem do Cabeçalho


const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Link de Navegação Ativo

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === id) {
                    link.classList.add('active');
                }
            });
        }
    });
}
window.addEventListener('scroll', updateActiveLink);

// Menu Mobile
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Elementos do chat
const chatBubble = document.getElementById('chatBubble');
const chatTyping = document.getElementById('chatTyping');
const chatMessage = document.getElementById('chatMessage');
let chatTimeouts = [];

function startChatAnimation() {
    // Resetar estado
    if (chatBubble) chatBubble.classList.remove('visible');
    if (chatTyping) chatTyping.classList.remove('hidden');
    if (chatMessage) chatMessage.classList.remove('visible');

    // Passo 1: Mostrar balão com dots de digitando (500ms de delay)

    const t1 = setTimeout(() => {
        if (chatBubble) chatBubble.classList.add('visible');
    }, 550);

    // Passo 2: Esconder dots e mostrar mensagem (2s total)
    const t2 = setTimeout(() => {
        if (chatTyping) chatTyping.classList.add('hidden');
        if (chatMessage) chatMessage.classList.add('visible');
    }, 2000);

    chatTimeouts.push(t1, t2);
}

function resetChatAnimation() {
    // Limpar timeouts pendentes
    chatTimeouts.forEach(t => clearTimeout(t));
    chatTimeouts = [];

    // Resetar estado
    if (chatBubble) chatBubble.classList.remove('visible');
    if (chatTyping) chatTyping.classList.remove('hidden');
    if (chatMessage) chatMessage.classList.remove('visible');
}

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        const isOpening = !mobileMenu.classList.contains('active');
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
        mobileMenu.setAttribute('aria-hidden', isOpening ? 'false' : 'true');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';

        if (isOpening) {
            startChatAnimation();
        } else {
            resetChatAnimation();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            resetChatAnimation();
        });
    });
}

// Revelação ao Rolar
const revealElements = document.querySelectorAll('.reveal-text, .work-card, .process-step');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Animação escalonada
            const delay = Array.from(revealElements).indexOf(entry.target) % 4;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay * 140);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Animações do Chat de Contato
const contactChat = document.querySelector('.chat-list');
const contactChatBubble1 = document.getElementById('contactChatBubble1');
const contactChatTyping1 = document.getElementById('contactChatTyping1');
const contactChatMessage1 = document.getElementById('contactChatMessage1');

const contactChatBubble2 = document.getElementById('contactChatBubble2');
const contactChatTyping2 = document.getElementById('contactChatTyping2');
const contactChatMessage2 = document.getElementById('contactChatMessage2');

if (contactChat) {
    const contactChatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Passo 1: Mostra a bolha 1 digitando
                if (contactChatBubble1) contactChatBubble1.parentElement.classList.add('active');

                // Passo 2: Mostra mensagem 1
                setTimeout(() => {
                    if (contactChatTyping1) contactChatTyping1.classList.add('hidden');
                    if (contactChatMessage1) contactChatMessage1.classList.add('visible');

                    // Passo 3: Mostra a bolha 2 digitando
                    setTimeout(() => {
                        if (contactChatBubble2) contactChatBubble2.parentElement.classList.add('active');

                        // Passo 4: Mostra mensagem 2
                        setTimeout(() => {
                            if (contactChatTyping2) contactChatTyping2.classList.add('hidden');
                            if (contactChatMessage2) contactChatMessage2.classList.add('visible');
                        }, 1500);

                    }, 800); // tempo de leitura da msg 1

                }, 1500); // tempo digitando a msg 1

                contactChatObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    contactChatObserver.observe(contactChat);
}

// Projetos dinâmicos (vindos da API própria)
const worksGrid = document.getElementById('worksGrid');

const ICON_VER_PROJETO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg> Ver Projeto';
const ICON_VER_CODIGO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> Ver Código';

function criarLinkAcao(url, classe, iconeHtml) {
    const a = document.createElement('a');
    a.href = url || '#';
    a.className = classe;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = iconeHtml;
    return a;
}

function criarCardProjeto(projeto) {
    const article = document.createElement('article');
    article.className = 'work-card visible';

    const figure = document.createElement('figure');
    figure.className = 'work-card-image';
    const img = document.createElement('img');
    img.src = projeto.imagemUrl || 'img/projeto 1.png';
    img.alt = projeto.titulo;
    img.loading = 'lazy';
    figure.appendChild(img);

    const info = document.createElement('div');
    info.className = 'work-card-info';

    const meta = document.createElement('p');
    meta.className = 'work-card-meta';
    const category = document.createElement('span');
    category.className = 'work-card-category';
    category.textContent = projeto.categoria;
    const year = document.createElement('span');
    year.className = 'work-card-year';
    year.textContent = projeto.ano;
    meta.append(category, year);

    const title = document.createElement('h3');
    title.className = 'work-card-title';
    title.textContent = projeto.titulo;

    const tech = document.createElement('p');
    tech.className = 'work-card-tech';
    tech.textContent = projeto.tecnologias;

    const actions = document.createElement('nav');
    actions.className = 'work-card-actions';
    actions.append(
        criarLinkAcao(projeto.linkProjeto, 'work-card-btn work-card-view', ICON_VER_PROJETO),
        criarLinkAcao(projeto.linkCodigo, 'work-card-btn work-card-btn-code', ICON_VER_CODIGO)
    );

    info.append(meta, title, tech, actions);
    article.append(figure, info);
    return article;
}

if (worksGrid) {
    fetch(`${window.API_BASE_URL}/api/projetos`)
        .then((res) => {
            if (!res.ok) throw new Error('Falha ao carregar projetos.');
            return res.json();
        })
        .then((projetos) => {
            worksGrid.innerHTML = '';
            if (!projetos.length) {
                worksGrid.innerHTML = '<p class="works-error">Nenhum projeto cadastrado ainda.</p>';
                return;
            }
            projetos.forEach((projeto) => worksGrid.appendChild(criarCardProjeto(projeto)));
        })
        .catch(() => {
            worksGrid.innerHTML = '<p class="works-error">Não foi possível carregar os projetos agora. Tente novamente mais tarde.</p>';
        });
}

// Formulário de Contato (envio real para a API)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const feedbackEl = document.getElementById('contactFormFeedback');
    const btnSpan = contactForm.querySelector('.btn-submit span');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnText = btnSpan.textContent;

    function validarFormulario({ nome, email, telefone, canalEnvio, mensagem }) {
        if (!nome.trim()) return 'Preencha seu nome.';
        if (!email.trim()) return 'Preencha seu email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Digite um email válido.';
        if (!telefone.trim()) return 'Preencha seu telefone.';
        if (telefone.replace(/\D/g, '').length < 10) return 'Digite um telefone válido, com DDD.';
        if (!canalEnvio) return 'Selecione uma opção de retorno.';
        if (!mensagem.trim()) return 'Escreva sua mensagem.';
        return null;
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nome = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const telefone = document.getElementById('contactPhone').value;
        const canalEnvio = document.getElementById('contactSubject').value;
        const mensagem = document.getElementById('contactMessage').value;

        feedbackEl.textContent = '';
        feedbackEl.className = 'form-feedback';

        const erroValidacao = validarFormulario({ nome, email, telefone, canalEnvio, mensagem });
        if (erroValidacao) {
            feedbackEl.textContent = erroValidacao;
            feedbackEl.classList.add('form-feedback-error');
            return;
        }

        submitBtn.disabled = true;
        btnSpan.textContent = 'Enviando...';

        try {
            const res = await fetch(`${window.API_BASE_URL}/api/mensagens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, telefone, canalEnvio, mensagem }),
            });

            if (!res.ok) throw new Error('Falha ao enviar mensagem.');

            btnSpan.textContent = 'Mensagem enviada!';
            feedbackEl.textContent = 'Obrigado! Vou te responder em breve.';
            feedbackEl.classList.add('form-feedback-success');
            contactForm.reset();
        } catch (err) {
            btnSpan.textContent = originalBtnText;
            feedbackEl.textContent = 'Não foi possível enviar sua mensagem agora. Tente novamente em instantes.';
            feedbackEl.classList.add('form-feedback-error');
        } finally {
            submitBtn.disabled = false;
            setTimeout(() => {
                btnSpan.textContent = originalBtnText;
                feedbackEl.textContent = '';
                feedbackEl.className = 'form-feedback';
            }, 4000);
        }
    });
}

// Rolagem Suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

    });
});

// Slider LinkedIn
(function () {
    const track = document.getElementById('liSliderTrack');
    const prevBtn = document.getElementById('liPrev');
    const nextBtn = document.getElementById('liNext');
    const dots = document.querySelectorAll('.li-dot');

    if (!track || !prevBtn || !nextBtn) return;

    const VISIBLE = 5;   // cards visíveis por vez
    const STEP = 1;      // cards avançados por clique
    const GAP = 12;      // px — deve bater com o gap do CSS .li-slider-track
    const TOTAL = track.children.length; // 9
    const MAX_PAGE = TOTAL - VISIBLE; // = 4 (posições de offset possíveis)

    let page = 0;

    function getCardWidth() {
        const card = track.children[0];
        return card ? card.offsetWidth : 0;
    }

    function goTo(newPage) {
        page = Math.max(0, Math.min(newPage, MAX_PAGE));

        const offset = page * STEP * (getCardWidth() + GAP);
        track.style.transform = `translateX(-${offset}px)`;

        // Atualiza dots
        dots.forEach((dot, i) => dot.classList.toggle('active', i === page));

        // Desabilita setas nos extremos
        prevBtn.disabled = page === 0;
        nextBtn.disabled = page === MAX_PAGE;
    }

    prevBtn.addEventListener('click', () => goTo(page - 1));
    nextBtn.addEventListener('click', () => goTo(page + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Estado inicial
    goTo(0);

    // Recalcular ao redimensionar
    window.addEventListener('resize', () => goTo(page));
})();
