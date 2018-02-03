import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';

module.exports = app => {
	const api = {};
	const config = app.config;
	const { usuario } = app.database.models;
	
	api.lista = (req, res) => {
		usuario.findAll({})
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};
	
	api.buscaPorId = (req, res) => {
		usuario.findOne({ where: req.params })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};
	
	api.adiciona = (req, res) => {
		let user = req.body;

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
		usuario.update(req.body, { where: req.params })
			.then(result => res.json(result))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};
	
	api.deleta = (req, res) => {
		usuario.destroy({ where: req.params })
			.then(() => res.sendStatus(HttpStatus.NO_CONTENT))
			.catch(() => res.status(HttpStatus.PRECONDITION_FAILED));
	};
	
	return api;
};
	