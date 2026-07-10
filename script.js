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

// Formulário de Contato (WhatsApp e Email)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value;

        if (subject === 'Email') {
            const emailSubject = encodeURIComponent(`Contato via Portfólio - ${name}`);
            const emailBody = encodeURIComponent(`Olá Kelvison!\n\nMe chamo ${name}.\nEmail para contato: ${email}\n\nMensagem:\n${message}`);
            window.location.href = `mailto:kelvison.marcos10@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        } else {
            const whatsappText = `Olá Kelvison! Me chamo ${name}.%0A%0A*Email:* ${email}%0A%0A*Mensagem:*%0A${message}`;
            const whatsappUrl = `https://wa.me/5582981222429?text=${whatsappText}`;
            window.open(whatsappUrl, '_blank');
        }

        const btnSpan = contactForm.querySelector('.btn-submit span');
        const originalText = btnSpan.textContent;
        btnSpan.textContent = 'Enviado!';
        contactForm.reset();
        setTimeout(() => { btnSpan.textContent = originalText; }, 3000);
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
