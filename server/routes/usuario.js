module.exports = (app) => {
	const api = app.controllers.usuario;

	app.route('/usuarios')
		.post(api.adiciona);

	app.route('/api/usuarios')
		.get(api.lista)
		.put(api.atualiza)
		.delete(api.deleta);
  };