const requireAuth = require('../../src/middlewares/requireAuth');
const { mockResponse } = require('../helpers/mockResponse');

describe('requireAuth', () => {
  it('libera a requisição quando há um admin na sessão', () => {
    const req = { session: { adminId: 1 } };
    const res = mockResponse();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responde 401 e não segue adiante quando não há admin na sessão', () => {
    const req = { session: {} };
    const res = mockResponse();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Não autenticado.' });
    expect(next).not.toHaveBeenCalled();
  });
});
