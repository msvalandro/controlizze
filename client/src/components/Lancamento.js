import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputCustomizado, { SelectCustomizado, CheckBoxDireitaCustomizado, SubmitCustomizado, RadioCustomizado } from './utils/CampoCustomizado';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import '../assets/css/lancamento.css';

export default class Lancamento extends Component {

	constructor() {
		super();
		this.state = {
			categorias: [], 
			msg: '',
			tipoAlerta: 'danger',
			id: 0
		};
	}

	componentWillMount() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/categorias/1', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar os dados do sistema.');
				}
			})
			.then(categorias => {
				this.setState({categorias});
			});
	}

	componentDidMount() {
		$('#check-emissaonf').click(function() {
			if ($(this).is(':checked')) {
				$('#numero-nota').removeAttr('disabled');
			} else {
				$('#numero-nota').val('');
				$('#numero-nota').attr('disabled', true);
			}
		});
	}

	componentWillReceiveProps() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.props.location.state !== undefined && this.props.empresa.id !== undefined) {
			fetch(`http://localhost:8080/api/lancamento/${this.props.location.state.id}/${this.props.empresa.id}`, requestInfo)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						this.setState({msg: 'Ocorreu um erro ao gravar o lançamento.', tipoAlerta: 'danger'});
						throw new Error('Não foi possível cadastrar o lançamento no sistema.');
					}
				})
				.then(result => {
					this.setState({id: result.id});
					this.descricao.input.value = result.descricao;
					if (result.tipolancamentoId === 1) {
						$('#receita').prop('checked', true);
					} else {
						$('#despesa').prop('checked', true);
					}
					this.categoriLancamento.value = result.categorialancamentoId;
					if (result.numeronf !== null) {
						$('#check-emissaonf').click();
						this.numeroNota.input.value = result.numeronf;
					}
					this.dataLancamento.input.value = this.formataData(result.data);
					this.valorLancamento.input.value = result.valor;
				});
		}
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
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.state.id === 0) {
			requestInfo.method = 'POST';
			requestInfo.body = JSON.stringify({descricao: this.descricao.input.value, tipolancamentoId: this.tipoLancamento.props.selectedValue, 
				categorialancamentoId: this.categoriLancamento.value, emissaoNf: this.emissaoNf.checked, numeronf: this.numeroNota.input.value, 
				data: this.dataLancamento.input.value, valor: this.valorLancamento.input.value, empresaId: this.props.empresa.id});
		} else {
			requestInfo.method = 'PUT';
			requestInfo.body = JSON.stringify({id: this.state.id, descricao: this.descricao.input.value, tipolancamentoId: this.tipoLancamento.props.selectedValue, 
				categorialancamentoId: this.categoriLancamento.value, emissaoNf: this.emissaoNf.checked, numeronf: this.numeroNota.input.value, 
				data: this.dataLancamento.input.value, valor: this.valorLancamento.input.value, empresaId: this.props.empresa.id});
		}

		fetch('http://localhost:8080/api/lancamentos', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					new TratadorErros().publicaErros(response.json());
				} else {
					this.setState({msg: 'Ocorreu um erro ao gravar o lançamento.', tipoAlerta: 'danger'});
					throw new Error('Não foi possível cadastrar o lançamento no sistema.');
				}
			})
			.then(result => {
				if (result !== undefined) {
					this.setState({msg: 'Dados gravados com sucesso.', tipoAlerta: 'success'});
					$('#notificacao-lancamento').show();				
					setTimeout(() => {
						$('#notificacao-lancamento').fadeOut(1000);						
					}, 2000);
					this.limpaForm();					
				}
			})
			.catch(error => console.log(error));
	}

	limpaForm() {
		this.descricao.input.value = '';
		if (this.emissaoNf.checked) $('#check-emissaonf').click();
		this.dataLancamento.input.value = '';
		this.valorLancamento.input.value = '';
	}

	trocaCategorias(value) {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch(`http://localhost:8080/api/categorias/${value}`, requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar os dados do sistema.');
				}
			})
			.then(categorias => {
				this.setState({categorias});
			});
	}

	render() {
		return(
			<div className="container">
				<Notificacao id="notificacao-lancamento" estilo={{marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />				
				<h1 style={{marginTop: '20px', marginBottom: '40px'}} 
					className="text-center">Cadastro de Lançamento</h1>
				<div className="row">
					<div className="col-md-2"></div>
					<form onSubmit={this.envia.bind(this)} className="row col-md-8">
						<div className="col-md-9">
							<InputCustomizado htmlFor="descricao" titulo="Descrição"
								tipo="text" id="descricao" required="true" nome="descricao"
								referencia={(input) => this.descricao = input}
								placeholder="Informe a descrição do lançamento aqui..." />
						</div>
						<div className="col-md-3">
							<label></label>
							<RadioCustomizado nome="tipo-lancamento" required="required"
								opcoes={[
									{id: 'receita', valor: 1, descricao: ' Receita'}, 
									{id: 'despesa', valor: 2, descricao: ' Despesa'}
								]}
								funcao={this.trocaCategorias.bind(this)}
								referencia={input => this.tipoLancamento = input} />
						</div>
						<div className="col-md-9">
							<SelectCustomizado titulo="Categoria" nome="categoria-lancamento"
								opcoes={this.state.categorias} required="required" id="categoria-lancamento"
								classe="select-lancamento" referencia={input => this.categoriLancamento = input}
								placeholder="Selecione uma categoria para o lançamento..." />
						</div>
						<div className="col-md-3"></div>
						<div className="col-md-3">
							<CheckBoxDireitaCustomizado id="check-emissaonf" titulo="Emissão de NF?" 
								referencia={input => this.emissaoNf = input} />
							<InputCustomizado htmlFor="numero-nota" tipo="number" 
								id="numero-nota" required="true" nome="numero-nota"
								disabled="true"
								referencia={(input) => this.numeroNota = input}
								placeholder="N° NF" />
						</div>
						<div className="col-md-9"></div>						
						<div className="col-md-4">
							<InputCustomizado htmlFor="data-lancamento" tipo="text" titulo="Data"
								id="data-lancamento" required="true" nome="data-lancamento"
								referencia={(input) => this.dataLancamento = input}
								placeholder="__/__/____" mascara="99/99/9999" />
						</div>
						<div className="col-md-5">
							<InputCustomizado htmlFor="valor-lancamento" tipo="number" titulo="Valor"
								id="valor-lancamento" required="true" nome="valor-lancamento"
								referencia={(input) => this.valorLancamento = input}
								placeholder="Informe o valor do lançamento..." step="0.01" />
						</div>
						<div className="col-md-3"></div>												
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