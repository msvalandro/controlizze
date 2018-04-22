import HttpStatus from 'http-status';

module.exports = (app) => {
	const api = {};
	const { empresa } = app.database.models;

	const validaData = data => {
		let errors = [];
		let	date = data.split('/');
		let day = parseInt(date[0]);
		let month = parseInt(date[1]);
		let year = parseInt(date[2]);

		if (isNaN(year) || isNaN(month) || isNaN(day)) {
			return true;
		}

		if (month < 1 || month > 12) {
			return true;
		}

		if (month === 1 || month === 3 || month === 5 || month === 7 || month === 9 || month === 11) {
			if (day < 1 || day > 31) {
				return true;
			}
		}

		if (month === 4 || month === 6 || month === 8 || month === 10 || month === 12) {
			if (day < 1 || day > 30) {
				return true;
			}
		}

		if (month === 2) {
			if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
				if (day < 1 || day > 29) {
					return true;
				}
			} else {
				if (day < 1 || day > 28) {
					return true;
				}
			}
		}

		return false;
	};

	const validaDados = dados => {
		let errors = [];

		// contando . / e - da máscara
		if (dados.cnpj.length < 18) { 
			errors.push({field: 'cnpj', message: 'O CNPJ deve conter 14 dígitos.'});
		}

		if (dados.nome.length < 6) { 
			errors.push({field: 'nome', message: 'O nome da empresa deve conter pelo menos 6 caracteres.'});
		}

		if (formataData(dados.data) > new Date()) {
			errors.push({field: 'data', message: 'A data de adesão ao MEI é maior que a data atual.'});			
		}

		if (validaData(dados.data)) {
			errors.push({field: 'data', message: 'Data inválida. Por favor, informe a data no formato dd/mm/yyyy.'});
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
        return new Date(date[2], date[1] - 1, date[0]);
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
		let errors = validaDados(dados);

		if (errors.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(errors);
			return;
		}

		dados.data = formataData(dados.data);
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

		dados.data = formataData(dados.data);
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
