jest.mock('../../src/config/prisma', () => ({
  projeto: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require('../../src/config/prisma');
const projetosController = require('../../src/controllers/projetos.controller');
const { mockResponse } = require('../helpers/mockResponse');

const erroNaoEncontrado = Object.assign(new Error('Record to update not found.'), { code: 'P2025' });

describe('projetos.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listar', () => {
    it('devolve os projetos ordenados do ano mais recente para o mais antigo', async () => {
      const projetos = [{ id: 1, titulo: 'Dashboard' }];
      prisma.projeto.findMany.mockResolvedValue(projetos);
      const res = mockResponse();

      await projetosController.listar({}, res, jest.fn());

      expect(prisma.projeto.findMany).toHaveBeenCalledWith({ orderBy: { ano: 'desc' } });
      expect(res.json).toHaveBeenCalledWith(projetos);
    });

    it('repassa ao errorHandler quando o banco falha', async () => {
      const erro = new Error('banco indisponível');
      prisma.projeto.findMany.mockRejectedValue(erro);
      const next = jest.fn();

      await projetosController.listar({}, mockResponse(), next);

      expect(next).toHaveBeenCalledWith(erro);
    });
  });

  describe('detalhar', () => {
    it('busca pelo id convertido para número e devolve o projeto', async () => {
      const projeto = { id: 7, titulo: 'Loja' };
      prisma.projeto.findUnique.mockResolvedValue(projeto);
      const res = mockResponse();

      await projetosController.detalhar({ params: { id: '7' } }, res, jest.fn());

      expect(prisma.projeto.findUnique).toHaveBeenCalledWith({ where: { id: 7 } });
      expect(res.json).toHaveBeenCalledWith(projeto);
    });

    it('responde 404 quando o projeto não existe', async () => {
      prisma.projeto.findUnique.mockResolvedValue(null);
      const res = mockResponse();

      await projetosController.detalhar({ params: { id: '999' } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado.' });
    });
  });

  describe('criar', () => {
    it('cria o projeto convertendo o ano para número e responde 201', async () => {
      const body = { titulo: 'Landing', categoria: 'Web', ano: '2025', tecnologias: 'HTML · CSS' };
      const criado = { id: 1, ...body, ano: 2025 };
      prisma.projeto.create.mockResolvedValue(criado);
      const res = mockResponse();

      await projetosController.criar({ body }, res, jest.fn());

      expect(prisma.projeto.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ titulo: 'Landing', ano: 2025 }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(criado);
    });

    it('responde 400 sem gravar nada quando falta um campo obrigatório', async () => {
      const body = { titulo: 'Sem tecnologias', categoria: 'Web', ano: 2025 };
      const res = mockResponse();

      await projetosController.criar({ body }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.projeto.create).not.toHaveBeenCalled();
    });
  });

  describe('atualizar', () => {
    it('envia ao banco apenas os campos informados (atualização parcial)', async () => {
      prisma.projeto.update.mockResolvedValue({ id: 3, titulo: 'Novo título' });
      const res = mockResponse();

      await projetosController.atualizar(
        { params: { id: '3' }, body: { titulo: 'Novo título' } },
        res,
        jest.fn(),
      );

      expect(prisma.projeto.update).toHaveBeenCalledWith({
        where: { id: 3 },
        data: { titulo: 'Novo título' },
      });
      expect(res.json).toHaveBeenCalledWith({ id: 3, titulo: 'Novo título' });
    });

    it('responde 404 quando o projeto não existe (erro P2025)', async () => {
      prisma.projeto.update.mockRejectedValue(erroNaoEncontrado);
      const res = mockResponse();
      const next = jest.fn();

      await projetosController.atualizar({ params: { id: '999' }, body: { titulo: 'x' } }, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).not.toHaveBeenCalled();
    });

    it('repassa ao errorHandler erros que não são de registro inexistente', async () => {
      const erro = new Error('conexão perdida');
      prisma.projeto.update.mockRejectedValue(erro);
      const next = jest.fn();

      await projetosController.atualizar({ params: { id: '1' }, body: {} }, mockResponse(), next);

      expect(next).toHaveBeenCalledWith(erro);
    });
  });

  describe('remover', () => {
    it('remove o projeto e responde 204 sem corpo', async () => {
      prisma.projeto.delete.mockResolvedValue({});
      const res = mockResponse();

      await projetosController.remover({ params: { id: '2' } }, res, jest.fn());

      expect(prisma.projeto.delete).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('responde 404 quando o projeto não existe (erro P2025)', async () => {
      prisma.projeto.delete.mockRejectedValue(erroNaoEncontrado);
      const res = mockResponse();

      await projetosController.remover({ params: { id: '999' } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Projeto não encontrado.' });
    });
  });
});
