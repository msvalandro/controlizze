module.exports = app => {

	const { usuario, tipolancamento, categorialancamento } = app.database.models;


    setTimeout(() => {
        const usuarioRoot = {
            primeiroNome: 'Root',
            sobreNome: 'User',
            email: 'root@mail.com',
            senha: 'admin123'
        };
        const receita = {
            descricao: 'Receita'
        };
        const despesa = {
            descricao: 'Despesa'
        };
        const comercio = {
            descricao: 'Revenda de Mercadorias',
            tipolancamentoId: 1,
            empresaId: null
        };
        const industria = {
            descricao: 'Venda de produtos fabricação própria',
            tipolancamentoId: 1,
            empresaId: null
        };
        const servico = {
            descricao: 'Prestação de Serviços',
            tipolancamentoId: 1,
            empresaId: null
        };
    
        usuario.find({where: {email: 'root@mail.com'}})
            .then(result => {
                if (result) {
                    console.log('Root already created!');
                } else {
                    usuario.create(usuarioRoot)
                        .then(u => console.log('Root user created.'))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));

        tipolancamento.find({where: {descricao: 'Receita'}})
            .then(result => {
                if (result) {
                    console.log('Receita already created!');
                } else {
                    tipolancamento.create(receita)
                        .then(r => console.log('Receita created.'))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));

        tipolancamento.find({where: {descricao: 'Despesa'}})
            .then(result => {
                if (result) {
                    console.log('Despesa already created!');
                } else {
                    tipolancamento.create(despesa)
                        .then(r => console.log('Despesa created.'))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));

        categorialancamento.find({where: {descricao: 'Revenda de Mercadorias'}})
            .then(result => {
                if (result) {
                    console.log('Comercio already created!');
                } else {
                    categorialancamento.create(comercio)
                        .then(r => console.log('Comercio created.'))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));

        categorialancamento.find({where: {descricao: 'Venda de produtos fabricação própria'}})
            .then(result => {
                if (result) {
                    console.log('Industria already created!');
                } else {
                    categorialancamento.create(industria)
                        .then(r => console.log('Industria created.'))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));

        categorialancamento.find({where: {descricao: 'Prestação de Serviços'}})
            .then(result => {
                if (result) {
                    console.log('Servico already created!');
                } else {
                    categorialancamento.create(servico)
                        .then(r => console.log('Servico created.'))
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));            
    }, 3000);
}