// Resposta falsa do Express: registra status e corpo sem subir servidor.
function mockResponse({ headersSent = false } = {}) {
  const res = { headersSent };
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.redirect = jest.fn(() => res);
  res.clearCookie = jest.fn(() => res);
  return res;
}

module.exports = { mockResponse };
