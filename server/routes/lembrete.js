module.exports = app => {
    const api = app.controllers.lembrete;

    app.route('/api/lembrete/:id/:empresaId')
        .get(api.busca)
        .delete(api.deleta);

    app.route('/api/lembretes/:id')
        .get(api.lista);

    app.route('/api/lembretes')
        .post(api.adiciona)
        .put(api.atualiza);
}