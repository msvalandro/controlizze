import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { SelectCustomizado } from '../utils/CampoCustomizado';
import '../../assets/css/reports.css';

export default class DespesasCategoria extends Component {

	constructor() {
		super();
		this.state = {
			ano: new Date().getFullYear(),
			arrayAnos: [],
			chartData: {},
			arrayChartData: []
		};
	}

	componentWillMount() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};
		
		if (this.props.empresa.id === undefined) {
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
					this.getLancamentos(empresa.id);
				});
		} else {
			this.setState({ano: new Date().getFullYear()});
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
				this.getCategorias(empresaId);
			})
			.catch(err => console.log(err));
	}

	getCategorias(empresaId) {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch(`http://localhost:8080/api/categorias/empresa/${empresaId}`, requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar o recurso no sistema.');
				}
			})
			.then(categorias => {
				this.setState({categorias});
				this.saldoMes();
			})
			.catch(err => console.log(err));
	}

	getChartData() {
		this.setState({
			chartData: {
				labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
				datasets: this.state.arrayChartData,
				options: {
					scales: {
						xAxes: [{
							stacked: true
						}],
						yAxes: [{
						   stacked: true
						}]
					}
				},
			}
		});
	}

	random_rgba() {
		let o = Math.round, r = Math.random, s = 255;
		return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 0.6 + ')';
	}

	saldoMes() {
		let dado = {};
		let arraySaldo = [];
		let arrayChartData = [];
		
		this.state.categorias.forEach(c => {
			dado = {};
			arraySaldo = [];	
			for(let i = 0; i < 12; i++) {
				let saldoMes = 0;

				this.state.lancamentos.forEach(l => {
					let d = new Date(l.data);
					
					if (l.tipolancamentoId === 2) {					
						if (c.id === l.categorialancamentoId && d.getMonth() === i && d.getFullYear() === parseInt(this.state.ano, 10)) {
							saldoMes += parseFloat(l.valor);
						}
					}
				});
				arraySaldo.push(saldoMes);
			}

			dado.label = c.descricao;
			dado.data = arraySaldo;
			dado.backgroundColor = this.random_rgba();
			arrayChartData.push(dado);
		});
		console.log(arrayChartData);
		this.setState({arrayChartData});
		this.getChartData();
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
		this.getLancamentos(this.props.empresa.id);
	}

	render() {
		return(
			<div className="container">
				<div className="row">
					<div className="col-md-9"></div>
					<div className="col-md-3">
						<SelectCustomizado nome="ano-referencia"
							opcoes={this.state.arrayAnos} 
							required="required" id="ano-referencia-despesas-categoria" funcao={this.atualizaAnoReferencia.bind(this)}
							classe="select-lancamento" referencia={input => this.anoReferencia = input}
							placeholder="Informe o ano de referência..." />
					</div>
				</div>
				<Bar 
					data={this.state.chartData}
					options={{
						title: {
							display: true,
							text: 'Despesas por Categoria',
							fontSize: 25
						},
						legend: {
							display: true,
							position: 'right'
						},
						scales: {
							xAxes: [{
								stacked: true
							}],
							yAxes: [{
							   stacked: true // this also..
							}]
						}
					}}
				/>
			</div>
		);
	}
}