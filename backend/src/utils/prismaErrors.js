// Código que o Prisma lança quando update/delete não encontra o registro.
const PRISMA_REGISTRO_NAO_ENCONTRADO = 'P2025';

function isRegistroNaoEncontrado(err) {
  return err.code === PRISMA_REGISTRO_NAO_ENCONTRADO;
}

module.exports = { isRegistroNaoEncontrado };
