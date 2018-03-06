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

		if (!(dados.data instanceof Date && !isNaN(dados.data.valueOf()))) { 
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

	const formataData = data => {
        let	date = data.split('/');
        return data.length < 10 ? 'Data inválida.' : new Date(date[2], date[1] - 1, date[0]);
	}

	api.lista = (req, res) => {
		empresa.findOne({ where: {usuarioId: req.user.id} })
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
		dados.data = formataData(dados.data);
		let errors = validaDados(dados);

		if (errors.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(errors);
			return;
		}

		dados.usuarioId = req.user.id;

		empresa.create(dados)
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.atualiza = (req, res) => {
		let dados = req.body;
		let errors = validaDados(dados);

		if (errors.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(errors);
			return;
		}

		dados.data = new Date(req.body.data);
		dados.usuarioId = req.user.id;

		empresa.update(req.body, { where: {usuarioId: req.user.id} })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.deleta = (req, res) => {
		empresa.destroy({ where: {usuarioId: req.user.id} })
			.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
};
