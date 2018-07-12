import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import { SelectCustomizado } from '../utils/CampoCustomizado';
import '../../assets/css/reports.css';

export default class Faturamento extends Component {

	constructor() {
		super();
		this.state = {
			ano: new Date().getFullYear(),
			arrayAnos: [],
			chartData: {},
			arraySaldo: [],
			lancamentos: []
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
				this.saldoMes();
			})
			.catch(err => console.log(err));
	}

	getChartData() {
		this.setState({
			chartData: {
				labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
				datasets: [
					{
						label: 'Receita',
						data: this.state.arraySaldo,
						backgroundColor: [
							'rgba(255, 99, 132, 0.6)',
							'rgba(54, 162, 235, 0.6)',
							'rgba(255, 206, 86, 0.6)',
							'rgba(75, 192, 192, 0.6)',
							'rgba(153, 102, 255, 0.6)',
							'rgba(255, 159, 64, 0.6)',
							'rgba(135, 206, 250, 0.6)',
							'rgba(186, 85, 211, 0.6)',
							'rgba(255, 165, 0, 0.6)',
							'rgba(224, 100, 99, 0.6)',
							'rgba(127, 255, 212, 0.6)',
							'rgba(50, 205, 50, 0.6)',
							'rgba(64, 132, 198, 0.6)'
						]
					}
				]
			}
		});
	}

	saldoMes() {
		let arraySaldo = [];
		for(let i = 0; i < 12; i++) {
			let saldoMes = 0;

			this.state.lancamentos.forEach(l => {
				let d = new Date(l.data);

				if (d.getMonth() === i && d.getFullYear() === parseInt(this.state.ano, 10)) {
					if (l.tipolancamentoId === 1) {
						saldoMes += parseFloat(l.valor);
					}
				}
			});

			arraySaldo.push(saldoMes);
		}

		this.setState({arraySaldo});
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
							required="required" id="ano-referencia" funcao={this.atualizaAnoReferencia.bind(this)}
							classe="select-lancamento" referencia={input => this.anoReferencia = input}
							placeholder="Informe o ano de referência..." />
					</div>
				</div>
				<Bar 
					data={this.state.chartData}
					options={{
						title: {
							display: true,
							text: 'Faturamento por Mês',
							fontSize: 25
						},
						legend: {
							display: true,
							position: 'right'
						}
					}}
				/>
			</div>
		);
	}
}