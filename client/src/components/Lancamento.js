import React, { Component } from 'react';
import $ from 'jquery';
import mask from 'jquery-mask-plugin';
import PubSub from 'pubsub-js';
import { RadioGroup, Radio } from 'react-radio-group';
import InputCustomizado, { SelectCustomizado, CheckBoxDireitaCustomizado, SubmitCustomizado, SpanErro } from './utils/CampoCustomizado';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import '../assets/css/lancamento.css';

export default class Lancamento extends Component {

	constructor() {
		super();
		this.state = {
			categorias: [], 
			selectedValue: 0,
			msg: '',
			tipoAlerta: 'danger'
		};

		this.handleChange = this.handleChange.bind(this);
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

		// mascara de data
		$('#data-lancamento').mask('00/00/0000', {
			placeholder: '__/__/____'
		});
	}

	handleChange(value) {
		this.setState({selectedValue: value});
	}

	envia(event) {
		event.preventDefault();

		const requestInfo = {
			method: 'POST',
			body: JSON.stringify({descricao: this.descricao.value, tipolancamentoId: this.state.selectedValue, 
				categorialancamentoId: this.categoriLancamento.value, emissaoNf: this.emissaoNf.checked, numeronf: this.numeroNota.value, 
				data: this.dataLancamento.value, valor: this.valorLancamento.value, empresaId: this.props.empresa.id}),
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

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
				} else {
					this.setState({msg: 'Ocorreu um erro ao gravar o lançamento.', tipoAlerta: 'danger'});
					$('#notificacao-lancamento').show();
				}
			})
			.catch(error => console.log(error));
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
							<RadioGroup name="tipo-lancamento" 
								selectedValue={this.state.selectedValue} onChange={this.handleChange} required >
								<div>
									<Radio id="receita" value="1" />
									<label style={{paddingLeft: '5px', margin: 0}} htmlFor="receita"> Receita</label>
								</div>
								<div>
									<Radio id="despesa" value="2" />
									<label style={{paddingLeft: '5px', margin: 0}} htmlFor="despesa"> Despesa</label>
								</div>				
							</RadioGroup>
							<SpanErro nome="tipo-lancamento" />
						</div>
						<div className="col-md-9">
							<SelectCustomizado titulo="Categoria" nome="categoria-lancamento"
								opcoes={this.state.categorias} required="required"
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
								placeholder="Informe a data do lançamento aqui..." />
						</div>
						<div className="col-md-5">
							<InputCustomizado htmlFor="valor-lancamento" tipo="number" titulo="Valor"
								id="valor-lancamento" required="true" nome="valor-lancamento"
								referencia={(input) => this.valorLancamento = input}
								placeholder="Informe o valor do lançamento..." />
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