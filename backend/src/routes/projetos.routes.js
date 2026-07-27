const { Router } = require('express');
const projetosController = require('../controllers/projetos.controller');
const requireAuth = require('../middlewares/requireAuth');

const router = Router();

router.get('/', projetosController.listar);
router.get('/:id', projetosController.detalhar);
router.post('/', requireAuth, projetosController.criar);
router.put('/:id', requireAuth, projetosController.atualizar);
router.delete('/:id', requireAuth, projetosController.remover);

module.exports = router;
