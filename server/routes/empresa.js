module.exports = (app) => {
	const api = app.controllers.empresa;

	app.route('/api/empresas')
		.get(api.lista)
		.post(api.adiciona)
		.put(api.atualiza)    
		.delete(api.deleta);
};
