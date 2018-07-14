import React, { Component } from 'react';
import swal from 'sweetalert2';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { TextAreaCustomizado } from './utils/CampoCustomizado';
import '../assets/css/modal.css';

export default class ModalEmpresa extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: 'danger',
			mostra: 1
		}
	}

	componentDidMount() {
		this.mostraModal();
	}

	componentWillReceiveProps() {
		if (this.props.mostra) {
			this.mostraModal();
		}
	}

	mostraModal() {
		swal({
			title: 'Aviso!',
			text: 'Você precisa cadastrar a sua empresa antes de começar a usar o sistema. Clique no botão OK para continuar.',
			confirmButtonColor: '#343a40'
		}).then(result => {
			if (result.value) {
				$('#modal-empresa').show();
			}
		});
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({cnpj: this.cnpj.input.value, nome: this.nome.input.value, 
				data: this.data.input.value, cep: this.cep.input.value, atividade: this.atividade.value}),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		this.setState({mostra: 1});

		fetch('http://localhost:8080/api/empresas', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					this.setState({mostra: 0});
					new TratadorErros().publicaErros(response.json());
				} else {
					this.mostraMensagem('Não foi possível acessar o recurso no sistema.');					
				}
			})
			.then(result => {
				if (result !== undefined) {
					$('#modal-empresa').hide();
					this.setState({
						msg: 'Empresa cadastrada com sucesso.',
						tipoAlerta: 'success'
					});
					$('#notificacao-modal-empresa').show();
					setTimeout(() => {
						$('#notificacao-modal-empresa').fadeOut(1000);
					}, 2000);
				}
			})
			.catch(() => this.state.mostra === 1 ? this.mostraMensagem('Não foi possível acessar o recurso no sistema.') : null);
	}

	mostraMensagem(mensagem) {
		this.setState({msg: mensagem});
		$('#notificacao-modal-empresa').show();
		setTimeout(() => {
			$('#notificacao-modal-empresa').fadeOut(1000);
		}, 2000);
	}

	render() {
		return(
			<div className="container">
				<Notificacao style={{marginTop: '50px'}} id="notificacao-modal-empresa" tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<div id="modal-empresa" className="modal" role="dialog">
					<div className="modal-dialog modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h3 className="modal-title text-center" style={{width: '100%'}}>Cadastro de Empresa</h3>
							</div>
							<div className="modal-body">
								<form>
									<InputCustomizado htmlFor="cnpj-modal" titulo="CNPJ"
										mascara="99.999.999/9999-99"
										tipo="text" id="cnpj-modal" required="true" nome="cnpj"
										referencia={(input) => this.cnpj = input}
										placeholder="__.___.___/____-__" />
									<InputCustomizado htmlFor="nome" titulo="Nome"
										tipo="text" id="nome" required="true" nome="nome"
										referencia={(input) => this.nome = input}
										placeholder="Informe o nome da empresa aqui..." />
									<InputCustomizado htmlFor="data-modal" titulo="Data de Adesão"
										mascara="99/99/9999"										
										tipo="text" id="data-modal" required="true" nome="data"
										referencia={(input) => this.data = input}
										placeholder="__/__/____" />
									<InputCustomizado htmlFor="cep-modal" titulo="CEP"
										mascara="99.999-999"
										tipo="text" id="cep-modal" required="true" nome="cep"
										referencia={(input) => this.cep = input}
										placeholder="__.___-___" />
									<TextAreaCustomizado htmlFor="atividade" titulo="Atividade"
										linha="3" coluna="50" nome="atividade"
										id="atividade" required="true" referencia={(input) => this.atividade = input}
										placeholder="Informe a atividade da empresa aqui..." />
								</form>
							</div>
							<div className="modal-footer">
								<button onClick={this.envia.bind(this)} type="button" className="btn btn-dark">Enviar</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}