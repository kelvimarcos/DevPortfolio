// Endereço base da API: localhost em dev, produção nos demais casos.
window.API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:3333'
    : 'https://devportfolio-4uju.onrender.com';
