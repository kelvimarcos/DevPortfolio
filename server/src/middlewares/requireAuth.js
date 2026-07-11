function requireAuth(req, res, next) {
  if (!req.session.adminId) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }
  next();
}

module.exports = requireAuth;
