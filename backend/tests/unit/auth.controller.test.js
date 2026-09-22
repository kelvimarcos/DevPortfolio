jest.mock('../../src/config/prisma', () => ({
  admin: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

const bcrypt = require('bcryptjs');
const prisma = require('../../src/config/prisma');
const authController = require('../../src/controllers/auth.controller');
const { mockResponse } = require('../helpers/mockResponse');

// custo baixo só para o teste ficar rápido; a comparação de senha continua real
const SENHA_CORRETA = 'senha-correta';
const adminCadastrado = {
  id: 1,
  email: 'admin@exemplo.com',
  senhaHash: bcrypt.hashSync(SENHA_CORRETA, 4),
};

describe('auth.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('com a senha correta, abre a sessão e devolve o admin sem o hash da senha', async () => {
      prisma.admin.findUnique.mockResolvedValue(adminCadastrado);
      const req = { body: { email: adminCadastrado.email, senha: SENHA_CORRETA }, session: {} };
      const res = mockResponse();

      await authController.login(req, res, jest.fn());

      expect(req.session.adminId).toBe(1);
      expect(res.json).toHaveBeenCalledWith({ id: 1, email: 'admin@exemplo.com' });
    });

    it('com a senha errada, responde 401 e não abre a sessão', async () => {
      prisma.admin.findUnique.mockResolvedValue(adminCadastrado);
      const req = { body: { email: adminCadastrado.email, senha: 'senha-errada' }, session: {} };
      const res = mockResponse();

      await authController.login(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas.' });
      expect(req.session.adminId).toBeUndefined();
    });

    it('com email desconhecido, responde com a mesma mensagem da senha errada', async () => {
      prisma.admin.findUnique.mockResolvedValue(null);
      const req = { body: { email: 'intruso@exemplo.com', senha: 'qualquer' }, session: {} };
      const res = mockResponse();

      await authController.login(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Credenciais inválidas.' });
    });

    it('sem email ou senha, responde 400 sem consultar o banco', async () => {
      const res = mockResponse();

      await authController.login({ body: { email: 'admin@exemplo.com' }, session: {} }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.admin.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('cria o primeiro admin guardando a senha como hash e responde 201', async () => {
      prisma.admin.findFirst.mockResolvedValue(null);
      prisma.admin.create.mockResolvedValue({ id: 1, email: 'novo@exemplo.com' });
      const res = mockResponse();

      await authController.register(
        { body: { email: 'novo@exemplo.com', senha: 'minha-senha' } },
        res,
        jest.fn(),
      );

      const { data, select } = prisma.admin.create.mock.calls[0][0];
      expect(data.senhaHash).not.toBe('minha-senha');
      expect(await bcrypt.compare('minha-senha', data.senhaHash)).toBe(true);
      expect(select).not.toHaveProperty('senhaHash');
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('responde 403 quando já existe um administrador', async () => {
      prisma.admin.findFirst.mockResolvedValue(adminCadastrado);
      const res = mockResponse();

      await authController.register({ body: { email: 'outro@exemplo.com', senha: 'x' } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(403);
      expect(prisma.admin.create).not.toHaveBeenCalled();
    });

    it('responde 400 quando falta a senha', async () => {
      const res = mockResponse();

      await authController.register({ body: { email: 'novo@exemplo.com' } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.admin.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('encerra a sessão, apaga o cookie e responde 204', () => {
      const req = { session: { destroy: (callback) => callback() } };
      const res = mockResponse();

      authController.logout(req, res, jest.fn());

      expect(res.clearCookie).toHaveBeenCalledWith('connect.sid');
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('repassa ao errorHandler quando a sessão não pode ser encerrada', () => {
      const erro = new Error('store indisponível');
      const req = { session: { destroy: (callback) => callback(erro) } };
      const res = mockResponse();
      const next = jest.fn();

      authController.logout(req, res, next);

      expect(next).toHaveBeenCalledWith(erro);
      expect(res.clearCookie).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('devolve os dados do admin da sessão sem o hash da senha', async () => {
      const dados = { id: 1, email: 'admin@exemplo.com', createdAt: '2026-01-01' };
      prisma.admin.findUnique.mockResolvedValue(dados);
      const res = mockResponse();

      await authController.me({ session: { adminId: 1 } }, res, jest.fn());

      expect(prisma.admin.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: { id: true, email: true, createdAt: true },
      });
      expect(res.json).toHaveBeenCalledWith(dados);
    });

    it('repassa ao errorHandler quando o banco falha', async () => {
      const erro = new Error('banco fora do ar');
      prisma.admin.findUnique.mockRejectedValue(erro);
      const next = jest.fn();

      await authController.me({ session: { adminId: 1 } }, mockResponse(), next);

      expect(next).toHaveBeenCalledWith(erro);
    });
  });
});
