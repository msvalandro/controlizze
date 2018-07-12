import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import InputCustomizado, { SubmitCustomizado } from '../utils/CampoCustomizado';
import '../../assets/css/reports.css';

export default class ResumoMensal extends Component {

	constructor() {
		super();
		this.state = {
			empresa: {},
			datainicio: '',
			datafinal: '',
			lancamentos: [],
			limiteMei: 60000,
			comercioSemNota: 0,
			comercioComNota: 0,
			industriaSemNota: 0,
			industriaComNota: 0,
			servicoSemNota: 0,
			servicoComNota: 0,
			saldoTotal: 0
		};
	}

	componentDidMount() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.props.empresa.data === undefined) {
			fetch('http://localhost:8080/api/empresas', requestInfo)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Não foi possível acessar o recurso no sistema.');
					}
				})
				.then(empresa => {
					this.setState({empresa});
				});
		} else {
			this.setState({empresa: this.props.empresa});
		}
	}

	envia(event) {
		event.preventDefault();

		this.setState({datainicio: this.formataData(this.datainicio.input.value)});
		this.setState({datafinal: this.formataData(this.datafinal.input.value)});

		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch(`http://localhost:8080/api/lancamentos/${this.state.empresa.id}`, requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar o recurso no sistema.');
				}
			})
			.then(lancamentos => {
				this.setState({lancamentos});
				this.calculaSaldos();
			})
			.catch(err => console.log(err));
	}

	formataData(date) {
		let data = new Date(date);
		let dia = data.getDate();
		let mes = data.getMonth() + 1;
		let ano = data.getFullYear();

		return `${(dia > 9 ? '' : '0') + dia}/${(mes > 9 ? '' : '0') + mes}/${ano}`;
	}

	calculaSaldos() {
		let comercioSemNota = 0;
		let comercioComNota = 0;
		let industriaSemNota = 0;
		let industriaComNota = 0;
		let servicoSemNota = 0;
		let servicoComNota = 0;
		let saldoTotal = 0;

		this.state.lancamentos.forEach(l => {
			let d = new Date(l.data);
			d.setHours(0, 0, 0, 0);
			let inicio = new Date(this.state.datainicio);
			inicio.setHours(0, 0, 0, 0);
			let fim = new Date(this.state.datafinal);
			fim.setHours(0, 0, 0, 0);

			//mudar depois
			if (d >= inicio && d <= fim) {
				if (l.categorialancamentoId === 2 && l.numeronf === null) {
					comercioSemNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 2) {
					comercioComNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 3 && l.numeronf === null) {
					industriaSemNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 3) {
					industriaComNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 4 && l.numeronf === null) { 
					servicoSemNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 4) {
					servicoComNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				}
			}
		});

		this.setState({comercioSemNota});
		this.setState({comercioComNota});
		this.setState({industriaSemNota});
		this.setState({industriaComNota});
		this.setState({servicoSemNota});
		this.setState({servicoComNota});
		this.setState({saldoTotal});
		this.setState({limiteMei: (this.state.limiteMei - saldoTotal)});
	}

	render() {
		return(
			<div style={{margin: '20px'}}>
				<div className="row" style={{paddingTop: '20px', paddingLeft: '20px'}}>
				<form onSubmit={this.envia.bind(this)}>
					<div className="row">
							<InputCustomizado htmlFor="datainicio" titulo="Data Inicial"
									mascara="99/99/9999"
									tipo="text" id="datainicio" required="true" nome="datainicio"
									referencia={(input) => this.datainicio = input} className="col-md-4"
									placeholder="__/__/____" />
							<InputCustomizado htmlFor="datafinal" titulo="Data Final"
									mascara="99/99/9999"
									tipo="text" id="datafinal" required="true" nome="datafinal"
									referencia={(input) => this.datafinal = input} className="col-md-4"
									placeholder="__/__/____" />
							<SubmitCustomizado estilo={{height: '36px', marginTop: '32px', marginLeft: '15px'}} tipo="submit"
									className="btn btn-success" valor="salva" titulo="Enviar" />
						</div>
					</form>
				</div>
				<div id="div-resumo-mensal" className="relatorio-impressao" ref={el => (this.resumoMensal = el)}>
					<h3 style={{textAlign: 'center', marginTop: '30px', backgroundColor: '#e4e3e3'}}>Relatório Mensal das Receitas Brutas - Empreendedor Individual</h3>
					<h6>{'CNPJ: ' + this.state.empresa.cnpj}</h6>
					<h6>{'EMPREENDEDOR INDIVIDUAL: ' + this.state.empresa.nome}</h6>
					<h6 className="font-weight-bold">{'PERÍODO DE EMISSÃO: ' + this.state.datainicio + ' a ' + this.state.datafinal}</h6>
					
					<h6 className="font-weight-bold" style={{backgroundColor: '#e4e3e3'}}>RECEITA BRUTA - REVENDA DE MERCADORIA (COMÉRCIO)</h6>
					<div className="row">
						<div className="col-md-11">
							<h6>{'1) Revenda de mercadorias com dispensa de emissão de documento fiscal'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {this.state.comercioSemNota.toFixed(2)}</h6>
						</div>					
					</div>	
					<div className="row">
						<div className="col-md-11">
							<h6>{'2) Revenda de mercadorias com documento fiscal emitido'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {this.state.comercioComNota.toFixed(2)}</h6>
						</div>
					</div>
					<div className="row">
						<div className="col-md-11">
							<h6>{'3) Total das receitas com revenda de mercadorias (1 + 2)'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {(parseFloat(this.state.comercioSemNota) + parseFloat(this.state.comercioComNota)).toFixed(2)}</h6>
						</div>				
					</div>
					
					<h6 className="font-weight-bold" style={{backgroundColor: '#e4e3e3'}}>RECEITA BRUTA - REVENDA DE PRODUTOS INDUSTRIALIZADOS (INDÚSTRIA)</h6>
					<div className="row">
						<div className="col-md-11">
							<h6>{'4) Venda de produtos industrializados com dispensa de emissão de documento fiscal'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {this.state.industriaSemNota.toFixed(2)}</h6>
						</div>					
					</div>	
					<div className="row">
						<div className="col-md-11">
							<h6>{'5) Venda de produtos industrializados com documento fiscal emitido'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {this.state.industriaComNota.toFixed(2)}</h6>
						</div>
					</div>
					<div className="row">
						<div className="col-md-11">
							<h6>{'6) Total das receitas com venda de produtos industrializados (4 + 5)'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {(parseFloat(this.state.industriaSemNota) + parseFloat(this.state.industriaComNota)).toFixed(2)}</h6>
						</div>				
					</div>

					<h6 className="font-weight-bold" style={{backgroundColor: '#e4e3e3'}}>RECEITA BRUTA - PRESTAÇÃO DE SERVIÇOS</h6>
					<div className="row">
						<div className="col-md-11">
							<h6>{'7) Receita com prestação de serviços com dispensa de emissão de documento fiscal'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {this.state.servicoSemNota.toFixed(2)}</h6>
						</div>					
					</div>	
					<div className="row">
						<div className="col-md-11">
							<h6>{'8) Receita com prestação de serviços com documento fiscal emitido'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {this.state.servicoComNota.toFixed(2)}</h6>
						</div>
					</div>
					<div className="row">
						<div className="col-md-11">
							<h6>{'9) Total das receitas com prestação de serviços (7 + 8)'}</h6>
						</div>
						<div className="col-md-1">
							<h6>R$ {(parseFloat(this.state.servicoSemNota) + parseFloat(this.state.servicoComNota)).toFixed(2)}</h6>
						</div>				
					</div>

					<div className="row" style={{marginLeft: 0, marginRight: 0, backgroundColor: '#e4e3e3', borderBottom: '1px solid'}}>
						<div className="col-md-11" style={{paddingLeft: 0}}>
							<h6 >{'10) Total Geral das receitas brutas do mês (3 + 5 + 9)'}</h6>
						</div>
						<div className="col-md-1" style={{paddingLeft: '29px'}}>
							<h6>R$ {this.state.saldoTotal.toFixed(2)}</h6>
						</div>				
					</div>

					<h6 style={{marginTop: '25px', borderBottom: '1px solid'}}>{'Limite restante de faturamento: R$ ' + this.state.limiteMei.toFixed(2)}</h6>					

					<h6 style={{marginTop: '25px'}}>{'ATENÇÃO: Este relatório é para simples conferência e não dever ser enviado a Receita Federal.'}</h6>					
				</div>

				<div className="row">
					<div className="col-md-9"></div>
					<div className="col-md-3" style={{textAlign: 'right'}}>
						<ReactToPrint 
							trigger={() => <button type="button" className="btn btn-lg btn-outline-dark"><i className="fas fa-print"></i></button>}
							bodyClass="relatorio-impressao-print"
							content={() => this.resumoMensal}
						/>
					</div>
				</div>
			</div>
		);
	}
}