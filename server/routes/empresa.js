module.exports = (app) => {
  const api = app.controllers.empresa;

  app.route('/api/empresas')
    .get(api.lista)
    .post(api.adiciona);

  app.route('/api/empresas/:id')
    .get(api.buscaPorId)
    .put(api.atualiza)
    .delete(api.deleta);
};
