import React, { Component } from 'react';
import Notificacao from './utils/Notificacao';
import InputCustomizado from './utils/InputCustomizado';
import InputSubmitCustomizado from './utils/InputSubmitCustomizado';
import '../assets/css/cadastro-usuario.css';

class CadastroUsuario extends Component {

	constructor() {
		super();
		this.state = {
			msg: ''
		}
	}

	envia(event) {
		event.preventDefault();

		if (this.senha.value !== this.senhaConfirma.value) {
			this.setState({msg: 'As senhas digitadas não conferem.'});			
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
				if (result.token) {
					localStorage.setItem('auth-token', result.token);
					localStorage.setItem('user-name', result.nome);					
					this.props.history.push('/');
				} else {
					this.setState({msg: result});					
				}
			})
			.catch(error => {
				this.setState({msg: 'Ocorreu um erro ao realizar o cadastro no sistema.'});
			});
	}

	render() {
		return(
			<div className="cadastro-usuario-tela">
				<Notificacao texto={this.state.msg} />
				<div className="container card cadastro-usuario-form col-md-6">
					<h2 className="text-center">Cadastro de Usuário</h2>
					<form onSubmit={this.envia.bind(this)}>
						<InputCustomizado htmlFor="nome" titulo="Nome"
							tipo="text" id="nome" required="true" referencia={(input) => this.nome = input}
							placeholder="Informe o seu nome aqui..." />
						<InputCustomizado htmlFor="email" titulo="E-mail"
							tipo="email" id="email" required="true" referencia={(input) => this.email = input}
							placeholder="Informe o seu e-mail aqui..." />
						<InputCustomizado htmlFor="senha" titulo="Senha"
							tipo="password" id="senha" required="true" referencia={(input) => this.senha = input}
							placeholder="Informe a sua senha aqui..." />
						<InputCustomizado htmlFor="senha-confirma" titulo="Senha"
							tipo="password" id="senha-confirma" required="true" referencia={(input) => this.senhaConfirma = input}
							placeholder="Confirme a sua senha aqui..." />
						<InputSubmitCustomizado tipo="submit" 
							className="btn btn-black btn-lg btn-block" titulo="Criar Conta" />
					</form>
				</div>
			</div>
		);
	}
}

export default CadastroUsuario;