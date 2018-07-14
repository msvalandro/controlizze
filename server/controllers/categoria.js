import HttpStatus from 'http-status';

module.exports = (app) => {
	const api = {};
	const { categorialancamento } = app.database.models;
	const { empresa } = app.database.models;
	let emp;
	
	const validaDados = dados => {
		let errors = [];

		if (dados.descricao.length < 3) { 
			errors.push({field: 'descricaoCategoria', message: 'A descrição deve conter no mínimo 3 caracteres.'});
		}
		
		return errors;
	}

	api.adiciona = (req, res) => {
		let dados = req.body;
		dados.tipolancamentoId = 2;	

		empresa.findOne({ where: {id: dados.empresaId} })
			.then(result => {
				emp = result;
				let errors = validaDados(dados);

				if (errors.length > 0) {
					res.status(HttpStatus.BAD_REQUEST).json(errors);
					return;
				}				
	
				categorialancamento.create(dados)
					.then(result => res.json(result))
					.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.atualiza = (req, res) => {
		let dados = req.body;

		empresa.findOne({ where: {id: dados.empresaId} })
			.then(result => {
				emp = result;
				let errors = validaDados(dados);

				if (errors.length > 0) {
					res.status(HttpStatus.BAD_REQUEST).json(errors);
					return;
				}

				categorialancamento.update(dados, { individualHooks: true, where: {id: dados.id}})
					.then(result => res.json(result))
					.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.lista = (req, res) => {  
		empresa.findOne({ where: {usuarioId: req.user.id} })
			.then(result => {
				emp = result;
				if (req.params.id == 1) {
					categorialancamento.findAll({ where: {tipolancamentoId: req.params.id}})
						.then(result => res.json(result))
						.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
				} else {
					categorialancamento.findAll({ where: {empresaId: emp.id}})
						.then(result => res.json(result))
						.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
				}
				
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));			
		
	};

	api.deleta = (req, res) => {	
		categorialancamento.destroy({ where: {id: req.params.id} })
			.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
			.catch(() => res.sendStatus(HttpStatus.PRECONDITION_FAILED));
	};

	api.listaCategoriasEmpresa = (req, res) => {  
		categorialancamento.findAll({ where: {empresaId: req.params.id}})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
};
