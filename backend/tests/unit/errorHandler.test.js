const errorHandler = require('../../src/middlewares/errorHandler');
const { mockResponse } = require('../helpers/mockResponse');

describe('errorHandler', () => {
  const req = { method: 'GET', originalUrl: '/api/projetos' };
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('devolve a mensagem original em erros 4xx', () => {
    const erro = Object.assign(new Error('Parâmetro inválido.'), { status: 400 });
    const res = mockResponse();

    errorHandler(erro, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Parâmetro inválido.' });
  });

  it('esconde detalhes internos em erros 500 e registra o contexto no log', () => {
    const erro = new Error('Invalid prisma.projeto.findMany() invocation');
    const res = mockResponse();

    errorHandler(erro, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno do servidor.' });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/projetos -> 500'),
      erro,
    );
  });

  it('repassa o erro ao Express quando a resposta já foi enviada', () => {
    const erro = new Error('falhou no meio da resposta');
    const res = mockResponse({ headersSent: true });
    const next = jest.fn();

    errorHandler(erro, req, res, next);

    expect(next).toHaveBeenCalledWith(erro);
    expect(res.status).not.toHaveBeenCalled();
  });
});
