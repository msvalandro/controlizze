import jwt from 'jsonwebtoken';

describe('Routes Empresas', () => {
	const Empresa = app.database.models.empresa;
	const Usuario = app.database.models.usuario;
	const jwtSecret = app.config.jwtSecret;
 	const defaultEmpresa = {
		id: 1,
		nome: 'Default Empresa',
  	};

  	let token;

  	beforeEach((done) => {
		Usuario
			.destroy({where: {}})
			.then(() => Usuario.create({
				nome: 'Teste',
				email: 'teste@gmail.com',
				senha: '123456'
			}))
			.then(user => {
				Empresa
					.destroy({where: {}})
					.then(() => Empresa.create(defaultEmpresa))
					.then(() => {
						token = jwt.sign({id: user.id}, jwtSecret);
						done();
					});
			});
 	});

  	describe('Route GET /empresas', () => {
		it('deve retornar uma lista de empresas', (done) => {
	  		request
				.get('/empresas')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
		  			expect(res.body[0].id).to.be.eql(defaultEmpresa.id);
					expect(res.body[0].nome).to.be.eql(defaultEmpresa.nome);
					done(err);
				});
		});
  	});

	describe('Route GET /empresas/{id}', () => {
		it('deve retornar uma empresa', (done) => {
			request
				.get('/empresas/1')
				.set('Authorization', `JWT ${token}`)
				.end((err, res) => {
					expect(res.body.id).to.be.eql(defaultEmpresa.id);
					expect(res.body.nome).to.be.eql(defaultEmpresa.nome);
					done(err);
				});
		});
	});

	describe('Route POST /empresas', () => {
		it('deve criar uma empresa', (done) => {
			const novaEmpresa = {
				id: 2,
				nome: 'Nova Empresa',
			};

			request
				.post('/empresas')
				.set('Authorization', `JWT ${token}`)
				.send(novaEmpresa)
				.end((err, res) => {
					expect(res.body.id).to.be.eql(novaEmpresa.id);
					expect(res.body.nome).to.be.eql(novaEmpresa.nome);
					done(err);
				});
			});
	});

	describe('Route PUT /empresas/{id}', () => {
		it('deve atualizar uma empresa', (done) => {
			const empresaAtualizada = {
				id: 1,
				nome: 'Empresa Atualizada',
			};

			request
				.put('/empresas/1')
				.set('Authorization', `JWT ${token}`)
				.send(empresaAtualizada)
				.end((err, res) => {
					expect(res.body).to.be.eql([1]);
					done(err);
				});
			});
	});

	describe('Route DELETE /empresas/{id}', () => {
		it('deve deletar uma empresa', (done) => {
			request
				.delete('/empresas/1')
				.set('Authorization', `JWT ${token}`)				
				.end((err, res) => {
					expect(res.statusCode).to.be.eql(204);
					done(err);
				});
			});
	});
});
