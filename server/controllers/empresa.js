import HttpStatus from 'http-status';

module.exports = (app) => {
	const api = {};
	const { empresa } = app.database.models;

	const validaDados = dados => {
		let errors = [];

		// contando . / e - da máscara
		if (dados.cnpj.length < 18) { 
			errors.push({field: 'cnpj', message: 'O CNPJ deve conter 14 dígitos.'});
		}

		if (dados.nome.length < 6) { 
			errors.push({field: 'nome', message: 'O nome da empresa deve conter pelo menos 6 caracteres.'});
		}

		if (dados.data.length < 10) { 
			errors.push({field: 'data', message: 'A data deve estar no formato dd/mm/yyyy.'});
		}

		if (dados.cep.length < 10) { 
			errors.push({field: 'cep', message: 'O CEP deve conter 8 dígitos.'});
		}

		if (dados.atividade.length < 1) { 
			errors.push({field: 'atividade', message: 'Você deve informar ao menos uma atividade.'});
		}

		return errors;
	}

	api.lista = (req, res) => {
		empresa.findAll({ where: {usuarioId: req.user.id} })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.buscaPorId = (req, res) => {
		empresa.findOne({ where: req.params })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.adiciona = (req, res) => {
		let dados = req.body;
		let errors = validaDados(dados);

		if (errors.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(errors);
			return;
		}

		dados.data = new Date(req.body.data);
		dados.usuarioId = req.user.id;

		empresa.create(dados)
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.atualiza = (req, res) => {
		empresa.update(req.body, { where: req.params })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.deleta = (req, res) => {
		empresa.destroy({ where: req.params })
			.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
};
