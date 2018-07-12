import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import { SelectCustomizado } from '../utils/CampoCustomizado';
import '../../assets/css/reports.css';

export default class ResumoFinanceiro extends Component {

	constructor() {
		super();
		this.state = {
			ano: new Date().getFullYear(),
			arrayAnos: [],
			arrayReceita: [],
			saldoReceita: 0,
			arrayDespesa: [],
			saldoDespesa: 0,
			arraySaldo: [],
			saldoMes: 0,
			arraySaldoAnterior: [],
			lancamentos: []
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
					this.montaArrayAnos(empresa.data);
					this.montaValoresTabela(empresa.id);
				});
		} else {
			this.setState({ano: new Date().getFullYear()});
			this.montaArrayAnos(this.props.empresa.data);
			this.montaValoresTabela(this.props.empresa.id);
		}
	}

	montaValoresTabela(empresaId) {
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
				this.saldoMesAnterior();
				this.saldoMes();
			})
			.catch(err => console.log(err));
	}

	saldoMesAnterior() {
		let arraySaldoAnterior = [];

		for(let i = 0; i < 12; i++) {
			let saldoMesAnterior = 0;

			this.state.lancamentos.forEach(l => {
				let d = new Date(l.data);
				d.setMonth(d.getMonth() + 1);

				if (d.getMonth() === i && (d.getFullYear() === parseInt(this.state.ano, 10) || (d.getMonth() === 11 && d.getFullYear() === parseInt(this.state.ano, 10) - 1))) {
					if (l.tipolancamentoId === 1) {
						saldoMesAnterior += parseFloat(l.valor);
					} else {
						saldoMesAnterior -= parseFloat(l.valor);
					}
				}
			});

			arraySaldoAnterior.push({id: i, valor: saldoMesAnterior});
		}
		this.setState({arraySaldoAnterior});
	}

	saldoMes() {
		let arraySaldo = [];
		let arrayReceita = [];
		let arrayDespesa = [];		

		for(let i = 0; i < 12; i++) {
			let saldoMes = 0;
			let saldoReceita = 0;			
			let saldoDespesa = 0;

			this.state.lancamentos.forEach(l => {
				let d = new Date(l.data);

				if (d.getMonth() === i && d.getFullYear() === parseInt(this.state.ano, 10)) {
					if (l.tipolancamentoId === 1) {
						saldoMes += parseFloat(l.valor);
						saldoReceita += parseFloat(l.valor);
					} else {
						saldoMes -= parseFloat(l.valor);
						saldoDespesa += parseFloat(l.valor);
					}
				}
			});

			arraySaldo.push({id: i, valor: saldoMes});
			arrayReceita.push({id: i, valor: saldoReceita});
			arrayDespesa.push({id: i, valor: saldoDespesa});			
		}
		let saldoTotal = 0;
		let saldoTotalReceita = 0;
		let saldoTotalDespesa = 0;

		arraySaldo.forEach(s => {
			saldoTotal += s.valor;
		});
		arrayReceita.forEach(s => {
			saldoTotalReceita += s.valor;
		});
		arrayDespesa.forEach(s => {
			saldoTotalDespesa += s.valor;
		});

		this.setState({arraySaldo});
		this.setState({arrayReceita});
		this.setState({arrayDespesa});		
		this.setState({saldoMes: saldoTotal});
		this.setState({saldoReceita: saldoTotalReceita});
		this.setState({saldoDespesa: saldoTotalDespesa});		
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

	formataData(data) {
		let dia = data.getDate();
		let mes = data.getMonth() + 1;
		let ano = data.getFullYear();

		return `${(dia > 9 ? '' : '0') + dia}/${(mes > 9 ? '' : '0') + mes}/${ano}`;
	}

	atualizaAnoReferencia(ano) {
		this.setState({ano});
		this.montaValoresTabela(this.props.empresa.id);
	}

	render() {
		return(
			<div style={{margin: '20px'}}>
				<div className="row">
					<div className="col-md-9"></div>
					<div className="col-md-3">
						<SelectCustomizado nome="ano-referencia"
							opcoes={this.state.arrayAnos} 
							required="required" id="ano-referencia" funcao={this.atualizaAnoReferencia.bind(this)}
							classe="select-lancamento" referencia={input => this.anoReferencia = input}
							placeholder="Informe o ano de referência..." />
					</div>
				</div>
				<div id="div-relatorio-impressao" className="relatorio-impressao" ref={el => (this.componentRef = el)}>
					<h3 style={{textAlign: 'center', marginTop: '30px'}}>Resumo Financeiro</h3>
					<div className="row">
						<div className="col-md-3"><h6>{`Data de Emissão: ${this.formataData(new Date())}`}</h6></div>
						<div className="col-md-6"></div>
						<div className="col-md-3"><h6 style={{float: 'right'}}>{`Ano de Referência: ${this.state.ano}`}</h6></div>
					</div>
					<div className="table-responsive">
						<table style={{marginTop: '20px'}} className="table table-report">
							<thead>
								<tr>
									<th></th>						
									<th>{'jan/' + this.state.ano}</th>
									<th>{'fev/' + this.state.ano}</th>
									<th>{'mar/' + this.state.ano}</th>
									<th>{'abr/' + this.state.ano}</th>
									<th>{'mai/' + this.state.ano}</th>
									<th>{'jun/' + this.state.ano}</th>
									<th>{'jul/' + this.state.ano}</th>
									<th>{'ago/' + this.state.ano}</th>
									<th>{'set/' + this.state.ano}</th>
									<th>{'out/' + this.state.ano}</th>
									<th>{'nov/' + this.state.ano}</th>
									<th>{'dez/' + this.state.ano}</th>
									<th>Resultado</th>
								</tr>					
							</thead>
							<tbody>
								<tr>
									<th>Saldo do Mês Anterior</th>
									{
										this.state.arraySaldoAnterior.map(s => {
											return(<td key={s.id}>{'R$ ' + s.valor.toFixed(2)}</td>);
										})
									}
									<th></th>
								</tr>
								<tr>
									<th>1 - Receita</th>
									{
										this.state.arrayReceita.map(s => {
											return(<td key={s.id}>{'R$ ' + s.valor.toFixed(2)}</td>);
										})
									}
									<th>{'R$ ' + this.state.saldoReceita.toFixed(2)}</th>
								</tr>
								<tr>
									<th>2 - Despesa</th>
									{
										this.state.arrayDespesa.map(s => {
											return(<td key={s.id}>{'R$ ' + s.valor.toFixed(2)}</td>);
										})
									}
									<th>{'R$ ' + this.state.saldoDespesa.toFixed(2)}</th>
								</tr>
								<tr>
									<th>Saldo (1 - 2)</th>
									{
										this.state.arraySaldo.map(s => {
											return(<td key={s.id}>{'R$ ' + s.valor.toFixed(2)}</td>);
										})
									}
									<th>{'R$ ' + this.state.saldoMes.toFixed(2)}</th>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div className="row">
					<div className="col-md-9"></div>
					<div className="col-md-3" style={{textAlign: 'right'}}>
						<ReactToPrint 
							trigger={() => <button type="button" className="btn btn-lg btn-outline-dark"><i className="fas fa-print"></i></button>}
							bodyClass="relatorio-impressao-print"
							content={() => this.componentRef}
						/>
					</div>
				</div>
			</div>
		);
	};
}