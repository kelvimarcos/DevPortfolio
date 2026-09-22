jest.mock('../../src/config/prisma', () => ({
  mensagem: {
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require('../../src/config/prisma');
const mensagensController = require('../../src/controllers/mensagens.controller');
const { mockResponse } = require('../helpers/mockResponse');

const corpoValido = {
  nome: 'Maria',
  email: 'maria@exemplo.com',
  telefone: '82999990000',
  canalEnvio: 'whatsapp',
  mensagem: 'Quero um site.',
};

// Simula a requisição do Express: tipo do corpo e cabeçalho Referer.
function montarRequisicao({ body, tipo = 'application/json', referer } = {}) {
  return {
    body,
    is: (tipoEsperado) => tipoEsperado === tipo,
    get: (cabecalho) => (cabecalho === 'referer' ? referer : undefined),
  };
}

describe('mensagens.controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('grava a mensagem enviada em JSON e responde 201', async () => {
      const registro = { id: 1, ...corpoValido, projetoId: 3 };
      prisma.mensagem.create.mockResolvedValue(registro);
      const res = mockResponse();

      await mensagensController.criar(
        montarRequisicao({ body: { ...corpoValido, projetoId: '3' } }),
        res,
        jest.fn(),
      );

      expect(prisma.mensagem.create).toHaveBeenCalledWith({
        data: { ...corpoValido, projetoId: 3 },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(registro);
    });

    it('grava projetoId como null quando nenhum projeto foi escolhido', async () => {
      prisma.mensagem.create.mockResolvedValue({ id: 2 });

      await mensagensController.criar(montarRequisicao({ body: corpoValido }), mockResponse(), jest.fn());

      expect(prisma.mensagem.create).toHaveBeenCalledWith({
        data: { ...corpoValido, projetoId: null },
      });
    });

    it('responde 400 sem gravar nada quando um campo obrigatório chega vazio', async () => {
      const telefoneVazio = { ...corpoValido, telefone: '' };
      const res = mockResponse();

      await mensagensController.criar(montarRequisicao({ body: telefoneVazio }), res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.mensagem.create).not.toHaveBeenCalled();
    });

    it('no envio por formulário, volta para a página de origem sem a query e o hash antigos', async () => {
      prisma.mensagem.create.mockResolvedValue({ id: 3 });
      const res = mockResponse();

      await mensagensController.criar(
        montarRequisicao({
          body: corpoValido,
          tipo: 'application/x-www-form-urlencoded',
          referer: 'https://kelvimarcos.github.io/DevPortfolio/?enviado=1#projetos',
        }),
        res,
        jest.fn(),
      );

      expect(res.redirect).toHaveBeenCalledWith(
        'https://kelvimarcos.github.io/DevPortfolio/?enviado=1#contato',
      );
      expect(res.json).not.toHaveBeenCalled();
    });

    it('no envio por formulário sem Referer, redireciona para a raiz', async () => {
      prisma.mensagem.create.mockResolvedValue({ id: 4 });
      const res = mockResponse();

      await mensagensController.criar(
        montarRequisicao({ body: corpoValido, tipo: 'application/x-www-form-urlencoded' }),
        res,
        jest.fn(),
      );

      expect(res.redirect).toHaveBeenCalledWith('/?enviado=1#contato');
    });
  });

  describe('listar', () => {
    it('devolve as mensagens mais recentes primeiro, com o título do projeto', async () => {
      const mensagens = [{ id: 1, projeto: { id: 3, titulo: 'Loja' } }];
      prisma.mensagem.findMany.mockResolvedValue(mensagens);
      const res = mockResponse();

      await mensagensController.listar({}, res, jest.fn());

      expect(prisma.mensagem.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        include: { projeto: { select: { id: true, titulo: true } } },
      });
      expect(res.json).toHaveBeenCalledWith(mensagens);
    });
  });

  describe('remover', () => {
    it('remove a mensagem e responde 204', async () => {
      prisma.mensagem.delete.mockResolvedValue({});
      const res = mockResponse();

      await mensagensController.remover({ params: { id: '5' } }, res, jest.fn());

      expect(prisma.mensagem.delete).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('responde 404 quando a mensagem não existe (erro P2025)', async () => {
      prisma.mensagem.delete.mockRejectedValue(Object.assign(new Error('not found'), { code: 'P2025' }));
      const res = mockResponse();

      await mensagensController.remover({ params: { id: '999' } }, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Mensagem não encontrada.' });
    });

    it('repassa ao errorHandler outros erros do banco', async () => {
      const erro = new Error('timeout');
      prisma.mensagem.delete.mockRejectedValue(erro);
      const next = jest.fn();

      await mensagensController.remover({ params: { id: '1' } }, mockResponse(), next);

      expect(next).toHaveBeenCalledWith(erro);
    });
  });
});
