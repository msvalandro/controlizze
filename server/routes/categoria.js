module.exports = (app) => {
	const api = app.controllers.categoria;

	app.route('/api/categorias')
		.post(api.adiciona)
		.put(api.atualiza);

	app.route('/api/categorias/:id')
		.get(api.lista)
		.delete(api.deleta);

	app.route('/api/categorias/empresa/:id')
		.get(api.listaCategoriasEmpresa);	
  };