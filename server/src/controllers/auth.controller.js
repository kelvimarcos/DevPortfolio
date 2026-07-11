const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

async function register(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const adminExistente = await prisma.admin.findFirst();
    if (adminExistente) {
      return res.status(403).json({ error: 'Já existe um administrador cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const admin = await prisma.admin.create({
      data: { email, senhaHash },
      select: { id: true, email: true, createdAt: true },
    });

    res.status(201).json(admin);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const senhaConfere = await bcrypt.compare(senha, admin.senhaHash);
    if (!senhaConfere) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    req.session.adminId = admin.id;
    res.json({ id: admin.id, email: admin.email });
  } catch (err) {
    next(err);
  }
}

function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.status(204).send();
  });
}

async function me(req, res, next) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.session.adminId },
      select: { id: true, email: true, createdAt: true },
    });
    res.json(admin);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, me };
