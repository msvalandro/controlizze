import React, { Component } from 'react';
import $ from 'jquery';
import swal from 'sweetalert2';
import PubSub from 'pubsub-js';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { CheckBoxCustomizado, SubmitCustomizado } from './utils/CampoCustomizado';

export default class Perfil extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger' 
		};
	}

	componentDidMount() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/usuarios', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar os dados do sistema.');
				}
			})
			.then(usuario => {
				this.primeiroNome.input.value = usuario.primeiroNome;
				this.sobreNome.input.value = usuario.sobreNome;
				this.email.input.value = usuario.email;
			});

		$('#check-senha').click(() => {
			$('#div-senha').slideToggle();
		});
	}

	envia(event) {
		event.preventDefault();
		let flagSenha;

		//check update senha
		if ($('#check-senha:checked').length > 0) {
			flagSenha = true;
			if (this.senha.value !== this.senhaConfirma.value) {
				this.setState({msg: 'As senhas digitadas não conferem.', tipoAlerta: 'danger'});
				$('#notificacao-perfil').show();
				return;
			}
		} else {
			flagSenha = false;
		}

		const requestInfo = {
			method: 'PUT',
			body: JSON.stringify({primeiroNome: this.primeiroNome.value, 
				sobreNome: this.sobreNome.value, email: this.email.value, senha: this.senha.value, flagSenha}),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/usuarios', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					new TratadorErros().publicaErros(response.json());
				} else {
					this.setState({msg: 'Falha ao alterar os dados no sistema.', tipoAlerta: 'danger'});
					throw new Error('Não foi possível cadastrar o usuário no sistema.');
				}
			})
			.then(result => {
				if (result[0] > 0) {
					this.setState({msg: 'Dados alterados com sucesso.', tipoAlerta: 'success'});
					$('#notificacao-perfil').show();				
					setTimeout(() => {
						$('#notificacao-perfil').fadeOut(1000);						
					}, 2000);
				} else {
					this.setState({msg: result, tipoAlerta: 'danger'});
					$('#notificacao-perfil').show();					
				}
			})
			.catch(error => console.log(error));
	}

	exclui(event) {
		event.preventDefault();

		swal({
			title: 'Você tem certeza?',
			text: "Seu usuário e todos os registros vinculados a ele serão excluídos.",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Sim, estou de acordo.',
			cancelButtonText: 'Não, cancelar.'
		}).then((result) => {
			if (result.value) {
				swal(
					'Deletado!',
					'Você será desconectado do sistema agora.',
					'success'
				).then(() => {
					const requestInfo = {
						method: 'DELETE',
						headers: new Headers({
							'Authorization': `bearer ${localStorage.getItem('auth-token')}`
						})
					};
					fetch('http://localhost:8080/api/usuarios', requestInfo)
						.then(response => {
							if (response.ok) {
								this.props.history.push('/logout');							
							} else {
								throw new Error('Não foi possível deletar o usuário do sistema.');
							}
						})
						.catch(error => console.log('Ocorreu um erro ao excluir o cadastro do sistema.'));
				});
			}
		});
	}

	render() {
		return(
			<div className="container">
				<Notificacao id="notificacao-perfil" estilo={{marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h1 style={{paddingTop: '20px', marginBottom: '40px'}} 
					className="text-center">Meu perfil</h1>
				<div className="row">			
					<div className="col-md-2"></div>
					<form className="col-md-8" onSubmit={this.envia.bind(this)}>
						<div className="row">
							<InputCustomizado className="col-md-6" htmlFor="primeiro-nome"
								titulo="Primeiro nome" tipo="text" id="primeiro-nome" 
								required="true" nome="primeiroNome"
								referencia={(input) => this.primeiroNome = input} />
							<InputCustomizado className="col-md-6" htmlFor="sobre-nome" 
								titulo="Sobrenome" tipo="text" id="sobre-nome" 
								required="true" nome="sobreNome"
								referencia={(input) => this.sobreNome = input} />
						</div>
						<InputCustomizado htmlFor="email" nome="email"
								titulo="E-mail" tipo="email" id="email" required="true"
								referencia={(input) => this.email = input} />
						<CheckBoxCustomizado id="check-senha" htmlFor="check-senha" titulo="Alterar senha" />
						<div id="div-senha" className="row" style={{marginTop: '20px', display: 'none'}}>						
							<InputCustomizado htmlFor="senha" titulo="Senha" className="col-md-6"
								tipo="password" id="senha" nome="senha"
								referencia={(input) => this.senha = input}
								placeholder="Informe a sua senha aqui..." />
							<InputCustomizado htmlFor="senha-confirma" titulo="Confirme a senha" className="col-md-6"
								tipo="password" id="senha-confirma" nome="senha"
								referencia={(input) => this.senhaConfirma = input}
								placeholder="Confirme a sua senha aqui..." />
						</div>
						<div className="form-group" style={{marginTop: '20px'}}>
							<SubmitCustomizado estilo={{width: '49%'}} tipo="submit"
								className="btn btn-success" valor="salva" titulo="Salvar alterações" />
							<SubmitCustomizado acao={this.exclui.bind(this)} estilo={{width: '49%', float: 'right', marginTop: 0}} 
								className="btn btn-danger" valor="exclui" titulo="Excluir conta" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}