const MENSAGEM_ERRO_INTERNO = 'Erro interno do servidor.';

// O Express só reconhece middleware de erro quando ele tem os 4 parâmetros.
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const isErroInterno = status >= 500;

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${status}`, err);

  // se a resposta já começou a ser enviada, o tratador padrão do Express encerra a conexão
  if (res.headersSent) return next(err);

  // detalhes de erros internos (ex.: mensagens do Prisma) ficam só no log
  const mensagem = isErroInterno ? MENSAGEM_ERRO_INTERNO : err.message;
  res.status(status).json({ error: mensagem });
}

module.exports = errorHandler;
