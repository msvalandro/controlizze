import React, { Component } from 'react';
import '../css/cadastroUsuario.css';

class CadastroUsuario extends Component {

	envia(event) {
		event.preventDefault();

		if (this.senha.value !== this.senhaConfirma.value) {
			console.log('As senhas digitadas não conferem.');
			return;
		}

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({nome: this.nome.value, email: this.email.value, senha: this.senha.value}),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		};

		fetch('http://localhost:8080/usuarios', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível cadastrar o usuário no sistema.');
				}
			})
			.then(result => {
				this.props.history.push('/');
			})
			.catch(error => {
				console.log('Falha ao realizar o cadastro no sistma.');
			});
	}

	render() {
		return(
			<div className="cadastro-usuario-tela">
				<div className="container card cadastro-usuario-form col-md-6">
					<h2 className="text-center">Cadastro de Usuário</h2>
					<form onSubmit={this.envia.bind(this)}>
						<div className="form-group">
							<label htmlFor="nome">Nome</label>
							<input type="text" className="form-control" id="nome" 
								ref={(input) => this.nome = input} placeholder="Informe o seu nome aqui..." />
						</div>
						<div className="form-group">
							<label htmlFor="email">E-mail</label>
							<input type="email" className="form-control" id="email" 
								ref={(input) => this.email = input} placeholder="Informe o seu e-mail aqui..." />
						</div>
						<div className="form-group">
							<label htmlFor="senha">Senha</label>
							<input type="password" className="form-control" id="senha" 
								ref={(input) => this.senha = input} placeholder="Informe a sua senha aqui..." />
						</div>
						<div className="form-group">
							<label htmlFor="senha-confirma">Confirme sua senha</label>
							<input type="password" className="form-control" id="senha-confirma" 
								ref={(input) => this.senhaConfirma = input} placeholder="Confirme a sua senha aqui..." />
						</div>
						<div className="form-group">
							<button type="submit" className="btn btn-black btn-lg btn-block">Criar Conta</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default CadastroUsuario;