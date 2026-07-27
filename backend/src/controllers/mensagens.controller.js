const prisma = require('../config/prisma');

async function criar(req, res, next) {
  try {
    const { nome, email, telefone, canalEnvio, mensagem, projetoId } = req.body;
    if (!nome || !email || !telefone || !canalEnvio || !mensagem) {
      return res.status(400).json({ error: 'nome, email, telefone, canalEnvio e mensagem são obrigatórios.' });
    }

    const registro = await prisma.mensagem.create({
      data: {
        nome,
        email,
        telefone,
        canalEnvio,
        mensagem,
        projetoId: projetoId ? Number(projetoId) : null,
      },
    });

    // envio tradicional de formulário volta para o site
    if (req.is('application/x-www-form-urlencoded')) {
      const origem = (req.get('referer') || '/').split('?')[0].split('#')[0];
      return res.redirect(`${origem}?enviado=1#contato`);
    }

    res.status(201).json(registro);
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { projeto: { select: { id: true, titulo: true } } },
    });
    res.json(mensagens);
  } catch (err) {
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    await prisma.mensagem.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Mensagem não encontrada.' });
    next(err);
  }
}

module.exports = { criar, listar, remover };
