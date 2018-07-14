import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import { SelectCustomizado } from '../utils/CampoCustomizado';
import '../../assets/css/reports.css';


export default class DeclaracaoAnual extends Component {

	constructor() {
		super();
		this.state = {
			ano: new Date().getFullYear(),
			arrayAnos: [],
			empresa: {},
			lancamentos: [],
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
					this.setState({ano: new Date().getFullYear()});
					this.setState({empresa});
					this.montaArrayAnos(empresa.data);
					this.getLancamentos(empresa.id);
				});
		} else {
			this.setState({ano: new Date().getFullYear()});
			this.setState({empresa: this.props.empresa});
			this.montaArrayAnos(this.props.empresa.data);
			this.getLancamentos(this.props.empresa.id);
		}
	}

	getLancamentos(empresaId) {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch(`http://localhost:8080/api/lancamentos/${empresaId}`, requestInfo)
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

	montaArrayAnos(dataEmpresa) {
		let anoEmpresa = new Date(dataEmpresa).getFullYear();
		let anoAtual = new Date().getFullYear();
		let arrayAnos = [];

		for(let i = anoEmpresa; i <= anoAtual; i++) {
			let j = {};
			
			j.id = i;
			j.descricao = i;

			arrayAnos.push(j);
		}

		this.setState({arrayAnos});
	}

	atualizaAnoReferencia(ano) {
		this.setState({ano});
		this.calculaSaldos();
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

			if (d.getFullYear() === parseInt(this.state.ano, 10)) {
				if (l.categorialancamentoId === 1 && l.numeronf === null) {
					comercioSemNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 1) {
					comercioComNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 2 && l.numeronf === null) {
					industriaSemNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 2) {
					industriaComNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 3 && l.numeronf === null) { 
					servicoSemNota += parseFloat(l.valor);
					saldoTotal += parseFloat(l.valor);
				} else if (l.categorialancamentoId === 3) {
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
				<div className="row">
					<div className="col-md-9"></div>
					<div className="col-md-3">
						<SelectCustomizado nome="ano-referencia-anual"
							opcoes={this.state.arrayAnos} 
							required="required" id="ano-referencia-anual" funcao={this.atualizaAnoReferencia.bind(this)}
							classe="select-lancamento" referencia={input => this.anoReferenciaAnual = input}
							placeholder="Informe o ano de referência..." />
					</div>
				</div>

				<div id="div-declaracao-anual" className="relatorio-impressao" ref={el => (this.declaracaoAnual = el)}>
					<h3 style={{textAlign: 'center', marginTop: '30px', backgroundColor: '#e4e3e3'}}>Declaração Anual de Recebimentos</h3>
					<h6>{'CNPJ: ' + this.state.empresa.cnpj}</h6>
					<h6>{'EMPREENDEDOR INDIVIDUAL: ' + this.state.empresa.nome}</h6>
					<h6 className="font-weight-bold">{'PERÍODO DE EMISSÃO: Ano de ' + this.state.ano}</h6>

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
							<h6>{'6) Total das receitas com prestação de serviços (7 + 8)'}</h6>
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

					<div className="row" style={{marginLeft: 0, marginRight: 0, marginTop: '25px', borderBottom: '1px solid'}}>
						<h6 className="col-md-5">{'Local e data:'}</h6>
						<h6 className="col-md-5">{'Assinatura do Empresário:'}</h6>
					</div>

					<h6 style={{marginTop: '25px'}}>{'ENCONTRAM-SE ANEXADOS A ESTE RELATÓRIO:'}</h6>
					<h6>{'- Os documentos fiscais comprobatórios das entradas das mercadorias e serviços tomados referentes ao período.'}</h6>					
					<h6>{'- As notas fiscais relativas às operações ou prestações realizadas eventualmente emitidas.'}</h6>					
				</div>

				<div className="row">
					<div className="col-md-9"></div>
					<div className="col-md-3" style={{textAlign: 'right'}}>
						<ReactToPrint 
							trigger={() => <button type="button" className="btn btn-lg btn-outline-dark"><i className="fas fa-print"></i></button>}
							bodyClass="relatorio-impressao-print"
							content={() => this.declaracaoAnual}
						/>
					</div>
				</div>					
			</div>
		);
	}
}