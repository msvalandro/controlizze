describe('Routes Usuarios', () => {
    const Usuario = app.database.models.usuario;
    const defaultUsuario = {
      id: 1,
      nome: 'Teste',
      email: 'teste@gmail.com',
      senha: '123456'
    };
  
    beforeEach((done) => {
      Usuario
        .destroy({ where: {} })
        .then(() => Usuario.create(defaultUsuario))
        .then(() => done());
    });
  
    describe('Route GET /usuarios', () => {
      it('deve retornar uma lista de usuarios', (done) => {
        request
          .get('/usuarios')
          .end((err, res) => {
            expect(res.body[0].id).to.be.eql(defaultUsuario.id);
            expect(res.body[0].nome).to.be.eql(defaultUsuario.nome);
            expect(res.body[0].email).to.be.eql(defaultUsuario.email);
            done(err);
          });
      });
    });
  
    describe('Route GET /usuarios/{id}', () => {
      it('deve retornar um usuario', (done) => {
        request
          .get('/usuarios/1')
          .end((err, res) => {
            expect(res.body.id).to.be.eql(defaultUsuario.id);
            expect(res.body.nome).to.be.eql(defaultUsuario.nome);
            expect(res.body.email).to.be.eql(defaultUsuario.email);
            done(err);
          });
      });
    });
  
    describe('Route POST /usuarios', () => {
      it('deve criar um usuario', (done) => {
        const novoUsuario = {
          id: 2,
          nome: 'Novo Usuario',
          email: 'novoteste@gmail.com',
          senha: 'senhanova'
        };
  
        request
          .post('/usuarios')
          .send(novoUsuario)
          .end((err, res) => {
            expect(res.body.id).to.be.eql(novoUsuario.id);
            expect(res.body.nome).to.be.eql(novoUsuario.nome);
            expect(res.body.email).to.be.eql(novoUsuario.email);
            done(err);
          });
      });
    });
  
    describe('Route PUT /usuarios/{id}', () => {
      it('deve atualizar um usuario', (done) => {
        const usuarioAtualizado = {
          id: 1,
          nome: 'Usuario Atualizado',
          email: 'teste2@gmail.com',
          senha: 'senha2'
        };
  
        request
          .put('/usuarios/1')
          .send(usuarioAtualizado)
          .end((err, res) => {
            expect(res.body).to.be.eql([1]);
            done(err);
          });
      });
    });
  
    describe('Route DELETE /usuarios/{id}', () => {
      it('deve deletar um usuario', (done) => {
        request
          .delete('/usuarios/1')
          .end((err, res) => {
            expect(res.statusCode).to.be.eql(204);
            done(err);
          });
      });
    });
  });
  