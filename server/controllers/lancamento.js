import HttpStatus from 'http-status';

module.exports = app => {
    const api = {};
    const { lancamento } = app.database.models;

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
        
        if (dados.tipolancamentoId === 2 && (dados.categorialancamentoId < 1 || dados.categorialancamentoId > 5)) { 
			errors.push({field: 'categoria-lancamento', message: 'Selecione uma categoria válida.'});
        }
        
        if (dados.emissaoNf === true && (dados.numeronf.length < 1 || dados.numeronf < 0)) { 
			errors.push({field: 'numero-nota', message: 'N° da NF inválido.'});
        }
        if (!(dados.data instanceof Date && !isNaN(dados.data.valueOf()))) { 
			errors.push({field: 'data-lancamento', message: 'A data deve estar no formato dd/mm/yyyy.'});
		}

        if (dados.valor.length < 1 || dados.valor < 0) { 
			errors.push({field: 'valor-lancamento', message: 'Você deve informar um valor válido.'});
		}

		return errors;
	}

    const formataData = data => {
        let	date = data.split('/');
        return data.length < 10 ? 'Data inválida.' : new Date(date[2], date[1] - 1, date[0]);
	}

    api.adiciona = (req, res) => {
        let dados = req.body;
        dados.data = formataData(dados.data);
        dados.numeronf = dados.numeronf === '' ? null : parseInt(dados.numeronf);
        let errors = validaDados(dados);
        delete dados.emissaoNf;

        if (errors.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(errors);
			return;
        }
        
        console.log(dados);

        lancamento.create(dados)
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
    };

    return api;
};