import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';
import Sequelize from 'sequelize';

module.exports = app => {
	const api = {};
	const config = app.config;
	const { usuario, empresa, lancamento } = app.database.models;
	const Op = Sequelize.Op;
	
	const validaDados = dados => {
		let errors = [];

		if (dados.primeiroNome.length < 1) { 
			errors.push({field: 'primeiroNome', message: 'Você deve informar um nome.'});
		}

		if (dados.sobreNome.length < 1) { 
			errors.push({field: 'sobreNome', message: 'Você deve informar um sobrenome.'});
		}

		if (dados.email.length < 1) { 
			errors.push({field: 'email', message: 'Você deve informar um e-mail.'});
		}

		if (typeof dados.senha != 'undefined' && dados.senha.length < 6) { 
			errors.push({field: 'senha', message: 'A senha deve ter no mínimo 6 dígitos.'});
		}

		return errors;
	}

	api.lista = (req, res) => {
		usuario.findOne({ where: req.user.id })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};
	
	api.adiciona = (req, res) => {
		let user = req.body;
		let errors = validaDados(user);

		if (errors.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(errors);
			return;
		}

		usuario.findOrCreate({where: {email: user.email}, defaults: user})
			.spread((user, created) => {
				if (created) {
					let usuario =  user.get({
						plain: true
					});
					const payload = {id: usuario.id};
					res.json({
						token: jwt.sign(payload, config.jwtSecret, {expiresIn: 84600})
					});
				} else {
					res.json('Já existe uma conta utilizando este e-mail.');
				}
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};
	
	api.atualiza = (req, res) => {
		let user = {};
		
		user.primeiroNome = req.body.primeiroNome;
		user.sobreNome = req.body.sobreNome;
		user.email = req.body.email;	

		if(req.body.flagSenha) {
			user.senha = req.body.senha;
		}

		console.log(user);

		let errors = validaDados(user);		

		if (errors.length > 0) {
			res.status(HttpStatus.BAD_REQUEST).json(errors);
			return;
		}

		usuario.findOne({where: {email: user.email, id: {[Op.ne]: req.user.id}}})
			.then(result => {
				if (!result) {
					usuario.update(user, { individualHooks: true, where: req.user })
						.then(result => res.json(result))
						.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
				} else {
					res.json('Já existe uma conta utilizando este e-mail.');
					return;
				}
			})
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};
	
	api.deleta = (req, res) => {
		empresa.findOne({where: {usuarioId: req.user.id}})
			.then(result => {
				lancamento.destroy({where: {empresaId: result.id}});
				usuario.destroy({ where: req.user })
					.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
					.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
			})
			.catch(err => console.log(err));
	};
	
	return api;
};
	