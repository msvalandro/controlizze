module.exports = (app) => {
	const api = app.controllers.lancamento;

	app.route('/api/lancamentos')
		.post(api.adiciona);
};