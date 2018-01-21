module.exports = (app) => {
	const api = app.api.usuario;

	app.route('/usuarios')
		.post(api.adiciona);

	app.route('/api/usuarios')
		.get(api.lista);
  
	app.route('/api/usuarios/:id')
		.get(api.buscaPorId)
		.put(api.atualiza)
		.delete(api.deleta);
  };
  