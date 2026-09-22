// Variáveis de ambiente dos testes: não dependem do .env local nem de banco real.
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'segredo-apenas-para-testes';
