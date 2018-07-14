import HttpStatus from 'http-status';
import Sequelize from 'sequelize';

module.exports = app => {
	const api = {};
	const { lembrete, empresa } = app.database.models;
	const Op = Sequelize.Op;
	let emp;

	const validaData = data => {
		let errors = [];
		let	date = data.split('/');
		let day = parseInt(date[0]);
		let month = parseInt(date[1]);
		let year = parseInt(date[2]);

		if (isNaN(year) || isNaN(month) || isNaN(day)) {
			return true;
		}

		if (year < 2008 || year > new Date().getFullYear()) {
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
		
		if (dados.nome.length < 1) { 
			errors.push({field: 'nome', message: 'O nome precisa ser preenchido.'});
		}

		if (!validaData(dados.data) && emp.data > formataData(dados.data)) {
			errors.push({field: 'data-lembrete', message: 'Data menor do que a data de abertura da empresa.'});			
		}

		if (validaData(dados.data)) {
			errors.push({field: 'data-lembrete', message: 'Data inválida. Por favor, informe a data no formato dd/mm/yyyy.'});
		}

		return errors;
	}

	const formataData = data => {
		let	date = data.split('/');
		return new Date(date[2], date[1] - 1, date[0]);
	}

	api.busca = (req, res) => {
		lembrete.findOne({ where: {id: req.params.id, empresaId: req.params.empresaId}})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.lista = (req, res) => {
		let hoje = new Date();
		hoje.setHours(0, 0, 0, 0);

		lembrete.findAll({ where: {empresaId: req.params.id, data: {[Op.gte]: hoje}} })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.adiciona = (req, res) => {
		let dados = req.body;

		empresa.findOne({ where: {id: dados.empresaId} })
			.then(result => {
				emp = result;
				let errors = validaDados(dados);

				if (errors.length > 0) {
					res.status(HttpStatus.BAD_REQUEST).json(errors);
					return;
				}

				dados.data = formataData(dados.data);

				lembrete.create(dados)
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

				dados.data = formataData(dados.data);

				lembrete.update(dados, { individualHooks: true, where: {id: dados.id}})
					.then(result => res.json(result))
					.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.deleta = (req, res) => {
		lembrete.destroy({ where: {id: req.params.id} })
			.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
}