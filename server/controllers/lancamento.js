import HttpStatus from 'http-status';

module.exports = app => {
	const api = {};
	const { lancamento } = app.database.models;
	const { empresa } = app.database.models;
	const { tipolancamento } = app.database.models;
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

		if (year < 2008 || year > (new Date().getFullYear() + 1)) {
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

		if (dados.descricao.length < 3) { 
			errors.push({field: 'descricao', message: 'A descrição deve conter no mínimo 3 caracteres.'});
		}	

		if (dados.tipolancamentoId < 1 || dados.tipolancamentoId > 2) { 
			errors.push({field: 'tipo-lancamento', message: 'Marque uma opção.'});
		}
		
		if (dados.tipolancamentoId == 1 && (dados.categorialancamentoId < 1 || dados.categorialancamentoId > 3)) { 
			errors.push({field: 'categoria-lancamento', message: 'Selecione uma categoria válida.'});
		}
		
		if (dados.tipolancamentoId === 2 && (dados.categorialancamentoId < 1)) { 
			errors.push({field: 'categoria-lancamento', message: 'Selecione uma categoria válida.'});
		}
		
		if (dados.emissaoNf === true && (dados.numeronf === null || dados.numeronf < 0)) { 
			errors.push({field: 'numero-nota', message: 'N° da NF inválido.'});
		}

		if (validaData(dados.data)) {
			errors.push({field: 'data-lancamento', message: 'Data inválida. Por favor, informe a data no formato dd/mm/yyyy.'});
		}

		if (!validaData(dados.data) && emp.data > formataData(dados.data)) {
			errors.push({field: 'data-lancamento', message: 'Data menor do que a data de abertura da empresa.'});
		}

		if (dados.valor.length < 1 || dados.valor < 0) { 
			errors.push({field: 'valor-lancamento', message: 'Você deve informar um valor válido.'});
		}

		return errors;
	};

	const formataData = data => {
		let	date = data.split('/');
		return new Date(date[2], date[1] - 1, date[0]);
	};

	api.lista = (req, res) => {
		lancamento.findAll({
				include: [{model: tipolancamento, required: true}], 
				where: {empresaId: req.params.id},
				order: ['data']
			})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.buscaPorId = (req, res) => {
		lancamento.findOne({where: {id: req.params.id, empresaId: req.params.empresaId}})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.adiciona = (req, res) => {
		let dados = req.body;
		let parcelas = dados.parcelas;
		delete dados.parcelas;		
		dados.numeronf = dados.numeronf === '' ? null : parseInt(dados.numeronf);

		empresa.findOne({ where: {id: dados.empresaId} })
			.then(result => {
				emp = result;
				let errors = validaDados(dados);
				delete dados.emissaoNf;

				if (errors.length > 0) {
					res.status(HttpStatus.BAD_REQUEST).json(errors);
					return;
				}

				dados.data = formataData(dados.data);			
				let lancamentos = [];
				const data = new Date(dados.data.getTime());

				if (dados.parcelado === true) {
					delete dados.parcelado;					
					for (let i = 0; i < parcelas; i++) {
						let d = Object.assign({}, dados);
						d.descricao = d.descricao + ` - Parcela ${i + 1}/${parcelas}`;
						let date = new Date(data.getTime());
						date.setMonth(data.getMonth() + i)
						d.data = date;				
						lancamentos.push(d);
					}
				} else {
					delete dados.parcelado;
					lancamentos.push(dados);
				}		

				lancamentos.forEach(l => {
					lancamento.create(l)
						.then(result => res.json(result))
						.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
				});
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.atualiza = (req, res) => {
		let dados = req.body;
		dados.numeronf = dados.numeronf === '' ? null : parseInt(dados.numeronf);

		empresa.findOne({ where: {id: dados.empresaId} })
			.then(result => {
				emp = result;
				let errors = validaDados(dados);
				delete dados.emissaoNf;

				if (errors.length > 0) {
					res.status(HttpStatus.BAD_REQUEST).json(errors);
					return;
				}

				dados.data = formataData(dados.data);

				lancamento.update(dados, { individualHooks: true, where: {id: dados.id}})
					.then(result => res.json(result))
					.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	api.deleta = (req, res) => {
		lancamento.destroy({ where: {id: req.params.id} })
			.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};

	return api;
};