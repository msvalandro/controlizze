import React, { Component } from 'react';
import $ from 'jquery';
import swal from 'sweetalert2';
import PubSub from 'pubsub-js';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { SubmitCustomizado, TextAreaCustomizado } from './utils/CampoCustomizado';

export default class Empresa extends Component {

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

		fetch('http://localhost:8080/api/empresas', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar os dados do sistema.');
				}
			})
			.then(empresa => {
				let data = this.formataData(empresa.data);

				this.cnpj.input.value = empresa.cnpj;
				this.nome.input.value = empresa.nome;
				this.data.input.value = data;
				this.cep.input.value = empresa.cep;
				this.atividade.value = empresa.atividade;
			});
	}

	formataData(date) {
		let data = new Date(date);
		let dia = data.getDate();
		let mes = data.getMonth() + 1;
		let ano = data.getFullYear();

		return `${(dia > 9 ? '' : '0') + dia}/${(mes > 9 ? '' : '0') + mes}/${ano}`;
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			method: 'PUT',
			body: JSON.stringify({cnpj: this.cnpj.value, nome: this.nome.value,
				data: this.data.value, cep: this.cep.value, atividade: this.atividade.value}),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/empresas', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					new TratadorErros().publicaErros(response.json());
				} else {
					this.setState({msg: 'Falha ao alterar os dados no sistema.', tipoAlerta: 'danger'});
					throw new Error('Não foi possível cadastrar a empresa no sistema.');
				}
			})
			.then(result => {
				if (result[0] > 0) {
					this.setState({msg: 'Dados alterados com sucesso.', tipoAlerta: 'success'});
					$('#notificacao-empresa').show();				
					setTimeout(() => {
						$('#notificacao-empresa').fadeOut(1000);						
					}, 2000);
				} else {
					this.setState({msg: result, tipoAlerta: 'danger'});
					$('#notificacao-empresa').show();
				}
			})
			.catch(error => console.log(error));
	}

	exclui(event) {
		event.preventDefault();

		swal({
			title: 'Você tem certeza?',
			text: "Sua empresa e todos os registros vinculados a ela serão excluídos.",
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
					'Você será redirecionado para a página inicial agora.',
					'success'
				).then(() => {
					const requestInfo = {
						method: 'DELETE',
						headers: new Headers({
							'Authorization': `bearer ${localStorage.getItem('auth-token')}`
						})
					};
					fetch('http://localhost:8080/api/empresas', requestInfo)
						.then(response => {
							if (response.ok) {
								this.props.history.push('/');
							} else {
								throw new Error('Não foi possível deletar a empresa do sistema.');
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
				<Notificacao id="notificacao-empresa" estilo={{marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h1 style={{paddingTop: '20px', marginBottom: '40px'}} 
					className="text-center">Minha empresa</h1>
				<div className="row">			
					<div className="col-md-2"></div>
					<form onSubmit={this.envia.bind(this)} className="col-md-8">
						<div className="row">
							<InputCustomizado htmlFor="nome" titulo="Nome"
								tipo="text" id="nome" required="true" nome="nome"
								referencia={(input) => this.nome = input} className="col-md-12"
								placeholder="Informe o nome da empresa aqui..." />
						</div>	
						<div className="row">
							<InputCustomizado htmlFor="cnpj" titulo="CNPJ"
								mascara="99.999.999/9999-99"
								tipo="text" id="cnpj" required="true" nome="cnpj"
								referencia={(input) => this.cnpj = input} className="col-md-4"
								placeholder="__.___.___/____-__" />
							<InputCustomizado htmlFor="data" titulo="Data de Adesão"
								mascara="99/99/9999"
								tipo="text" id="data" required="true" nome="data"
								referencia={(input) => this.data = input} className="col-md-4"
								placeholder="__/__/____" />
							<InputCustomizado htmlFor="cep" titulo="CEP"
								mascara="99.999-999"
								tipo="text" id="cep" required="true" nome="cep"
								referencia={(input) => this.cep = input} className="col-md-4"
								placeholder="__.___-___" />
						</div>
						<TextAreaCustomizado htmlFor="atividade" titulo="Atividade"
							linha="3" coluna="50" nome="atividade"
							id="atividade" required="true" className="col-md-12"
							referencia={(input) => this.atividade = input}
							placeholder="Informe a atividade da empresa aqui..." />
						<div className="form-group" style={{marginTop: '20px'}}>
							<SubmitCustomizado estilo={{width: '49%'}} tipo="submit"
								className="btn btn-success" valor="salva" titulo="Salvar alterações" />
							<SubmitCustomizado acao={this.exclui.bind(this)} estilo={{width: '49%', float: 'right', marginTop: 0}} 
								className="btn btn-danger" valor="exclui" titulo="Excluir empresa" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}