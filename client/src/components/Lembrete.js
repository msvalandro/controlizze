import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import Notificacao from './utils/Notificacao';
import TratadorErros from './utils/TratadorErros';
import InputCustomizado, { SubmitCustomizado, TextAreaCustomizado } from './utils/CampoCustomizado';

export default class Lembrete extends Component {

    constructor() {
        super();
        this.state = {
            msg: '',
			tipoAlerta: 'danger',
			id: 0,
			mascaraData: '99/99/9999'
        };
	}
	
	componentWillReceiveProps() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		setTimeout(() => {
			if (this.props.location.state !== undefined && this.props.location.state.id !== 0 && this.props.empresa.id !== undefined) {
				fetch(`http://localhost:8080/api/lembrete/${this.props.location.state.id}/${this.props.empresa.id}`, requestInfo)
					.then(response => {
						if (response.ok) {
							return response.json();
						} else {
							this.setState({msg: 'Ocorreu um erro ao acessar o recurso no sistema.', tipoAlerta: 'danger'});
							throw new Error('Ocorreu um erro ao acessar o recurso no sistema.');
						}
					})
					.then(result => {
						this.setState({id: result.id});
						this.descricao.value = result.descricao;
						this.setState({mascaraData: ''});
						this.data.input.value = this.formataData(result.data);
						this.nome.input.value = result.nome;
					});
			} else if (this.props.location.state !== undefined) {
				if (this.props.location.state.id === 0) {
					this.setState({id: 0});
					this.setState({mascaraData: '99/99/9999'});
					this.limpaForm();
				}
			}
		}, 300);
	}

    envia(event) {
		event.preventDefault();
		
		const requestInfo = {
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.state.id === 0) {
			requestInfo.method = 'POST';
			requestInfo.body = JSON.stringify({
				nome: this.nome.input.value,
				data: this.data.input.value,
				descricao: this.descricao.value,
				empresaId: this.props.empresa.id
			});
		} else {
			requestInfo.method = 'PUT';
			requestInfo.body = JSON.stringify({
				id: this.state.id,
				nome: this.nome.input.value,
				data: this.data.input.value,
				descricao: this.descricao.value,
				empresaId: this.props.empresa.id
			});
		}

		fetch('http://localhost:8080/api/lembretes', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					new TratadorErros().publicaErros(response.json());
				} else {
					this.setState({msg: 'Ocorreu um erro ao gravar o lembrete.', tipoAlerta: 'danger'});
					throw new Error('Não foi possível cadastrar o lembrete no sistema.');
				}
			})
			.then(result => {
				if (result !== undefined) {
					this.setState({msg: 'Dados gravados com sucesso.', tipoAlerta: 'success'});
					$('#notificacao-lembrete').show();				
					setTimeout(() => {
						$('#notificacao-lembrete').fadeOut(1000);						
					}, 2000);
					this.limpaForm();					
				}
			})
			.catch(error => console.log(error));
	}

	formataData(date) {
		let data = new Date(date);
		let dia = data.getDate();
		let mes = data.getMonth() + 1;
		let ano = data.getFullYear();

		return `${(dia > 9 ? '' : '0') + dia}/${(mes > 9 ? '' : '0') + mes}/${ano}`;
	}
	
	limpaForm() {
		this.nome.input.value = '';
		this.nome.value = '';
		this.descricao.value = '';
		this.data.value = '';
		this.data.input.value = '';
	}

    render() {
        return(
            <div className="container">
				<Notificacao id="notificacao-lembrete" estilo={{marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />				
                <h1 style={{paddingTop: '20px', marginBottom: '40px'}} 
					className="text-center">Cadastro de Lembrete</h1>
                <div className="row">
					<div className="col-md-2"></div>
					<form onSubmit={this.envia.bind(this)} className="row col-md-8">
						<div className="col-md-12">
							<InputCustomizado htmlFor="nome" titulo="Nome"
								tipo="text" id="nome" required="true" nome="nome"
								referencia={(input) => this.nome = input}
								placeholder="Informe o nome do lembrete aqui..." />
						</div>
						<div className="col-md-4">
							<InputCustomizado htmlFor="data-lembrete" tipo="text" titulo="Data"
								id="data-lembrete" required="true" nome="data-lembrete"
								referencia={(input) => this.data = input}
								placeholder="__/__/____" mascara="99/99/9999" />
						</div>
						<TextAreaCustomizado htmlFor="descricao" titulo="Descrição"
							linha="3" nome="descricao"
							id="descricao" className="col-md-12"
							referencia={(input) => this.descricao = input}
							placeholder="Informe a descrição da empresa aqui..." />							
						<div className="form-group col-md-12 text-center" style={{marginTop: '20px'}}>
							<SubmitCustomizado tipo="submit"
								className="btn btn-lg btn-block btn-success" valor="salva" titulo="Gravar" />
						</div>				
					</form>
				</div>
            </div>
        );
    }
}