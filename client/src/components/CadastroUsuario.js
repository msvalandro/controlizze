import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { SubmitCustomizado } from './utils/CampoCustomizado';
import '../assets/css/cadastro-usuario.css';

class CadastroUsuario extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger',
			mostra: 1
		}
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({
				primeiroNome: this.primeiroNome.input.value, 
				sobreNome: this.sobreNome.input.value, 
				email: this.email.input.value, 
				senha: this.senha.input.value,
				senhaConfirma: this.senhaConfirma.input.value

			}),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		};

		this.setState({mostra: 1});

		fetch('http://localhost:8080/usuarios', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					this.setState({mostra: 0});
					new TratadorErros().publicaErros(response.json());
				} else {
					this.setState({msg: 'Ocorreu um erro ao realizar o cadastro no sistema.', tipoAlerta: 'danger'});
					throw new Error('Não foi possível cadastrar o usuário no sistema.');
				}
			})
			.then(result => {
				if (result) {
					if (result.token) {
						localStorage.setItem('auth-token', result.token);
						this.props.history.push('/');
					} else {
						this.setState({msg: result});
					}
				}
			})
			.catch(() => this.state.mostra === 1 ? this.mostraMensagem('Não foi possível acessar o recurso no sistema.') : null);
	}

	mostraMensagem(mensagem) {
		this.setState({msg: mensagem});
		$('#notificacao-cadastro-usuario').show();
		setTimeout(() => {
			$('#notificacao-cadastro-usuario').fadeOut(1000);
		}, 2000);
	}

	render() {
		return(
			<div className="fundo-tela">
				<Notificacao id="notificacao-cadastro-usuario" tipoAlerta="danger" texto={this.state.msg} />
				<div className="container card cadastro-usuario-form col-md-6">
					<h2 style={{marginTop: '10px'}} className="text-center">Cadastro de Usuário</h2>
					<form className="cadastro-usuario" onSubmit={this.envia.bind(this)}>
						<div className="row">
							<InputCustomizado htmlFor="primeiro-nome" titulo="Primeiro nome" className="col-md-6"
								tipo="text" id="primeiro-nome" required="true" nome="primeiroNome"
								referencia={(input) => this.primeiroNome = input}
								placeholder="Informe o seu primeiro nome aqui..." />
							<InputCustomizado htmlFor="sobrenome" titulo="Sobrenome" className="col-md-6"
								tipo="text" id="nome" required="true" nome="sobreNome"
								referencia={(input) => this.sobreNome = input}
								placeholder="Informe o seu sobrenome aqui..." />
						</div>
						<InputCustomizado htmlFor="email" titulo="E-mail"
							tipo="email" id="email" required="true" nome="email"
							referencia={(input) => this.email = input}
							placeholder="Informe o seu e-mail aqui..." />
						<InputCustomizado htmlFor="senha" titulo="Senha"
							tipo="password" id="senha" required="true" nome="senha" 
							referencia={(input) => this.senha = input}
							placeholder="Informe a sua senha aqui..." />
						<InputCustomizado htmlFor="senha-confirma" titulo="Confirme a senha"
							tipo="password" id="senha-confirma" required="true" nome="senha" 
							referencia={(input) => this.senhaConfirma = input}
							placeholder="Confirme a sua senha aqui..." />
						<div className="form-group">
							<SubmitCustomizado tipo="submit" 
								className="btn btn-black btn-lg btn-block" titulo="Criar Conta" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default CadastroUsuario;