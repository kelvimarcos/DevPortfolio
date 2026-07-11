const { Router } = require('express');
const mensagensController = require('../controllers/mensagens.controller');
const requireAuth = require('../middlewares/requireAuth');

const router = Router();

router.post('/', mensagensController.criar);
router.get('/', requireAuth, mensagensController.listar);
router.delete('/:id', requireAuth, mensagensController.remover);

module.exports = router;
