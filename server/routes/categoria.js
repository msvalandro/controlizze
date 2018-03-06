module.exports = (app) => {
	const api = app.controllers.categoria;

	app.route('/api/categorias/:id')
		.get(api.lista);
  };