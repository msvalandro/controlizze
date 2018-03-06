import HttpStatus from 'http-status';

module.exports = (app) => {
	const api = {};
    const { categorialancamento } = app.database.models;

	api.lista = (req, res) => {  
		categorialancamento.findAll({ where: {tipolancamentoId: req.params.id}})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
};
