module.exports = (app) => {
	const api = app.controllers.lancamento;

	app.route('/api/lancamentos')
		.post(api.adiciona)
		.put(api.atualiza);

	app.route('/api/lancamentos/:id')
		.get(api.lista);

	app.route('/api/lancamento/:id/:empresaId')
		.get(api.buscaPorId)
		.delete(api.deleta);
};