const prisma = require('../config/prisma');

async function listar(req, res, next) {
  try {
    const projetos = await prisma.projeto.findMany({ orderBy: { ano: 'desc' } });
    res.json(projetos);
  } catch (err) {
    next(err);
  }
}

async function detalhar(req, res, next) {
  try {
    const projeto = await prisma.projeto.findUnique({ where: { id: Number(req.params.id) } });
    if (!projeto) return res.status(404).json({ error: 'Projeto não encontrado.' });
    res.json(projeto);
  } catch (err) {
    next(err);
  }
}

async function criar(req, res, next) {
  try {
    const { titulo, categoria, ano, tecnologias, linkProjeto, linkCodigo, imagemUrl } = req.body;
    if (!titulo || !categoria || !ano || !tecnologias) {
      return res.status(400).json({ error: 'titulo, categoria, ano e tecnologias são obrigatórios.' });
    }

    const projeto = await prisma.projeto.create({
      data: { titulo, categoria, ano: Number(ano), tecnologias, linkProjeto, linkCodigo, imagemUrl },
    });
    res.status(201).json(projeto);
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const { titulo, categoria, ano, tecnologias, linkProjeto, linkCodigo, imagemUrl } = req.body;

    const projeto = await prisma.projeto.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(categoria !== undefined && { categoria }),
        ...(ano !== undefined && { ano: Number(ano) }),
        ...(tecnologias !== undefined && { tecnologias }),
        ...(linkProjeto !== undefined && { linkProjeto }),
        ...(linkCodigo !== undefined && { linkCodigo }),
        ...(imagemUrl !== undefined && { imagemUrl }),
      },
    });
    res.json(projeto);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Projeto não encontrado.' });
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    await prisma.projeto.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Projeto não encontrado.' });
    next(err);
  }
}

module.exports = { listar, detalhar, criar, atualizar, remover };
