import React, { Component } from 'react';
import Notificacao from './utils/Notificacao';
import '../assets/css/login.css';
import logo from '../assets/img/random-logo2.png';
import { Link } from 'react-router-dom';

class Login extends Component {

	constructor() {
		super();
		this.state = {
			msg: ''
		}
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({email: this.email.value, senha: this.senha.value}),
			headers: new Headers({
				'Content-type': 'application/json'
			})
		};

		fetch('http://localhost:8080/autentica', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível fazer o login.');
				}
			})
			.then(result => {
				localStorage.setItem('auth-token', result.token);
				this.props.history.push('/');
			})
			.catch(error => {
				this.setState({msg: 'Usuário ou senha inválidos.'})
			});
	}

	render() {
		return(
			<div className="fundo-tela">
				<Notificacao tipoAlerta="danger" texto={this.state.msg} />
				<div className="container">
					<div className="card card-container">
						<img src={logo} alt="logo" className="img-card" />
						<form onSubmit={this.envia.bind(this)} className="form-signin">
							<input type="email" id="email" className="form-control" 
								ref={(input) => this.email = input} placeholder="Digite o e-mail..." required autoFocus />
							<input type="password" id="password" className="form-control" 
								ref={(input) => this.senha = input} placeholder="Digite a senha..." required />
							<button className="btn-log btn-lg btn-primary btn-block btn-signin" type="submit">Entrar</button>
						</form>
						<Link to={'/usuario/novo'} className="link-nova-conta">Ainda não possui uma conta?</Link>
					</div>
				</div>
			</div>			
		);
	}
}

export default Login;