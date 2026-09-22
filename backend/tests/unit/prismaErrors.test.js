const { isRegistroNaoEncontrado } = require('../../src/utils/prismaErrors');

describe('isRegistroNaoEncontrado', () => {
  it('retorna true para o erro P2025 do Prisma (registro não encontrado)', () => {
    expect(isRegistroNaoEncontrado({ code: 'P2025' })).toBe(true);
  });

  it('retorna false para outros códigos do Prisma', () => {
    expect(isRegistroNaoEncontrado({ code: 'P2002' })).toBe(false);
  });

  it('retorna false para um erro comum sem código', () => {
    expect(isRegistroNaoEncontrado(new Error('falha qualquer'))).toBe(false);
  });
});
