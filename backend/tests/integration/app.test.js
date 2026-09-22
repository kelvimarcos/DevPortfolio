// Integração: requisições HTTP reais ao app (rotas, middlewares, controllers e errorHandler).
// Só o Prisma é simulado, para os testes não dependerem de banco.
jest.mock('../../src/config/prisma', () => ({
  projeto: { findMany: jest.fn(), delete: jest.fn() },
  mensagem: { create: jest.fn(), findMany: jest.fn() },
}));

const request = require('supertest');
const prisma = require('../../src/config/prisma');
const app = require('../../src/app');

const mensagemValida = {
  nome: 'Maria',
  email: 'maria@exemplo.com',
  telefone: '82999990000',
  canalEnvio: 'whatsapp',
  mensagem: 'Quero um site.',
};

describe('API (integração)', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('GET /health responde que a API está no ar', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('responde 404 em JSON para rotas inexistentes', async () => {
    const res = await request(app).get('/rota-que-nao-existe');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Rota não encontrada.' });
  });

  describe('rotas públicas', () => {
    it('GET /api/projetos lista os projetos vindos do banco', async () => {
      prisma.projeto.findMany.mockResolvedValue([{ id: 1, titulo: 'Dashboard' }]);

      const res = await request(app).get('/api/projetos');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: 1, titulo: 'Dashboard' }]);
    });

    it('GET /api/projetos responde 500 sem vazar a mensagem interna do banco', async () => {
      prisma.projeto.findMany.mockRejectedValue(
        new Error('Invalid prisma.projeto.findMany() invocation: tenant/user not found'),
      );

      const res = await request(app).get('/api/projetos');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Erro interno do servidor.' });
      expect(JSON.stringify(res.body)).not.toContain('prisma');
    });

    it('POST /api/mensagens em JSON incompleto responde 400', async () => {
      const res = await request(app).post('/api/mensagens').send({ nome: 'Maria', email: 'maria@exemplo.com' });

      expect(res.status).toBe(400);
      expect(prisma.mensagem.create).not.toHaveBeenCalled();
    });

    it('POST /api/mensagens com JSON malformado responde 400 pelo errorHandler', async () => {
      const res = await request(app).post('/api/mensagens').set('Content-Type', 'application/json').send('{"nome": ');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('POST /api/mensagens pelo formulário do site grava e redireciona de volta ao contato', async () => {
      prisma.mensagem.create.mockResolvedValue({ id: 10 });

      const res = await request(app)
        .post('/api/mensagens')
        .type('form')
        .set('Referer', 'https://kelvimarcos.github.io/DevPortfolio/')
        .send({ ...mensagemValida, projetoId: '2' });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('https://kelvimarcos.github.io/DevPortfolio/?enviado=1#contato');
      expect(prisma.mensagem.create).toHaveBeenCalledWith({
        data: { ...mensagemValida, projetoId: 2 },
      });
    });
  });

  describe('rotas privadas sem login', () => {
    it('GET /api/mensagens responde 401 e não consulta o banco', async () => {
      const res = await request(app).get('/api/mensagens');

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Não autenticado.' });
      expect(prisma.mensagem.findMany).not.toHaveBeenCalled();
    });

    it('DELETE /api/projetos/:id responde 401 e não remove nada', async () => {
      const res = await request(app).delete('/api/projetos/1');

      expect(res.status).toBe(401);
      expect(prisma.projeto.delete).not.toHaveBeenCalled();
    });

    it('GET /api/auth/me responde 401', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });
});
