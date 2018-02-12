import React, { Component } from 'react';
import swal from 'sweetalert2';
import $ from 'jquery';
import mask from 'jquery-mask-plugin';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { TextAreaCustomizado } from './utils/CampoCustomizado';
import '../assets/css/modal.css';

export default class ModalEmpresa extends Component {

	constructor() {
		super();
		this.state = {
			msg: '',
			tipoAlerta: ''
		}
	}

	componentDidMount() {
		swal({
			title: 'Aviso!',
			text: 'Você precisa cadastrar a sua empresa antes de começar a usar o sistema. Clique no botão OK para continuar.',
			confirmButtonColor: '#343a40'
		}).then(result => {
			if (result.value) {
				$('#modal-empresa').show();
			}
		});

		// mascara de CNPJ
		$("#cnpj").mask('00.000.000/0000-00', {
			placeholder: '__.___.___/____-__'
		});

		// mascara de data
		$("#data").mask('00/00/0000', {
			placeholder: '__/__/____'
		});

		$("#cep").mask('00.000-000', {
			placeholder: '__.___-___'
		});
	}

	envia(event) {
		event.preventDefault();

		if (this.cnpj.value.length < 18) {
			this.setState({msg: 'O CNPJ deve conter 14 dígitos.'});
		}

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({cnpj: this.cnpj.value, nome: this.nome.value, 
				data: this.data.value, cep: this.cep.value, atividade: this.atividade.value}),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/empresas', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível cadastrar a empresa no sistema.');
				}
			})
			.then(result => {
				$('#modal-empresa').hide();
				this.setState({
					msg: 'Empresa cadastrada com sucesso.',
					tipoAlerta: 'success'
				});
			})
			.catch(error => console.log(error));
	}

	render() {
		return(
			<div>
				<Notificacao tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />				
				<div id="modal-empresa" className="modal" role="dialog">
					<div className="modal-dialog modal-lg" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h3 className="modal-title text-center" style={{width: '100%'}}>Cadastro de Empresa</h3>
							</div>
							<div className="modal-body">
								<form>
									<InputCustomizado htmlFor="cnpj" titulo="CNPJ"
										tipo="text" id="cnpj" required="true" referencia={(input) => this.cnpj = input}
										placeholder="Informe o CNPJ da empresa aqui..." />
									<span>{this.state.msg}</span>
									<InputCustomizado htmlFor="nome" titulo="Nome"
										tipo="text" id="nome" required="true" referencia={(input) => this.nome = input}
										placeholder="Informe o nome da empresa aqui..." />
									<InputCustomizado htmlFor="data" titulo="Data de Adesão"
										tipo="text" id="data" required="true" referencia={(input) => this.data = input}
										placeholder="Informe a data de adesão ao MEI aqui..." />
									<InputCustomizado htmlFor="cep" titulo="CEP"
										tipo="text" id="cep" required="true" referencia={(input) => this.cep = input}
										placeholder="Informe o CEP da empresa aqui..." />
									<TextAreaCustomizado htmlFor="atividade" titulo="Atividade"
										linha="3" coluna="50"
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