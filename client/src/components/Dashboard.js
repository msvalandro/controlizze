import React, { Component } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import $ from 'jquery';
import '../assets/css/calendario.css';

export default class Dashboard extends Component {

	constructor() {
		super();
		this.state = {
			lancamentos: [],
			lembretes: [],
			categorias: [],
			saldo: 0,
			arraySaldo: [],
			arrayDespesas: [],
			arrayCategorias: [],
			cores: [],
			chartData: {},
			faturamentoData: {},
			date: new Date()
		}
	}

	componentWillReceiveProps() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		setTimeout(() => {
			if (this.props.empresa !== {} && this.props.empresa !== null) {
				fetch(`http://localhost:8080/api/lancamentos/${this.props.empresa.id}`, requestInfo)
						.then(response => {
							if (response.ok) {
								return response.json();
							} else {
								throw new Error('Não foi possível acessar os dados do sistema.');
							}
						})
						.then(lancamentos => {
							this.setState({lancamentos});
							this.getLembretes(this.props.empresa.id);
							this.calculaSaldo();
							this.calculaReceita();
							this.getCategorias(this.props.empresa.id);
						});
			}
		}, 200);
	}

	getLembretes(empresaId) {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch(`http://localhost:8080/api/lembretes/${this.props.empresa.id}`, requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar os dados do sistema.');
				}
			})
			.then(lembretes => {
				this.setState({lembretes});
				this.configuraCalendario();
			});
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
				this.calculaDespesa();
			})
			.catch(err => console.log(err));
	}

	calculaDespesa() {
		let arrayDespesas = [];
		let arrayCategorias = [];
		let cores = [];

		this.state.categorias.forEach(c => {
			let saldoDespesas = 0;

			this.state.lancamentos.forEach(l => {
				let d = new Date(l.data);

				if (l.tipolancamentoId === 2) {
					if (c.id === l.categorialancamentoId && d.getFullYear() === new Date().getFullYear()) {
						saldoDespesas += parseFloat(l.valor);
					}
				}
			});

			arrayCategorias.push(c.descricao);
			arrayDespesas.push(saldoDespesas);
			cores.push(this.random_rgba());
		});
		this.setState({arrayCategorias});
		this.setState({arrayDespesas});
		this.setState({cores});
		
		this.getChartData();
	}

	calculaReceita() {
		let arraySaldo = [];
		for(let i = 0; i < 12; i++) {
			let saldoMes = 0;

			this.state.lancamentos.forEach(l => {
				let d = new Date(l.data);

				if (d.getMonth() === i && d.getFullYear() === new Date().getFullYear()) {
					if (l.tipolancamentoId === 1) {
						saldoMes += parseFloat(l.valor);
					}
				}
			});

			arraySaldo.push(saldoMes);
		}

		this.setState({arraySaldo});
		this.getFaturamentoData();
	}

	getChartData() {
		this.setState({
			chartData: {
				labels: this.state.arrayCategorias,
				datasets: [
					{
						data: this.state.arrayDespesas,
						backgroundColor: this.state.cores
					}
				] 
			}
		});
	}

	getFaturamentoData() {
		this.setState({
			faturamentoData: {
				labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
				datasets: [
					{
						label: 'Receita',
						data: this.state.arraySaldo,
						backgroundColor: [
							'rgba(135, 181, 212, 0.6)'
						]
					}
				]
			}
		});
	}

	calculaSaldo() {
		let saldo = 0;

		this.state.lancamentos.forEach(l => {
			if (l.tipolancamentoId === 1) {
				saldo += parseFloat(l.valor);
			} else {
				saldo -= parseFloat(l.valor);
			}
		});
		this.setState({saldo});
	}

	random_rgba() {
		let o = Math.round, r = Math.random, s = 255;
		return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 0.6 + ')';
	}

	onChange(date) {
		this.setState({date});
	}

	configuraCalendario() {
		$('.react-calendar').addClass('menu-calendario');
		let time = $('.tile-lembrete').find('time');

		for (let i = 0; i < time.length; i++) {
			const element = time[i];
			let date = new Date(element.getAttribute('datetime'));
			
			this.state.lembretes.forEach(l => {
				let data = new Date(l.data);
				if (date.getDate() === data.getDate() && date.getMonth() === data.getMonth() && date.getFullYear() === data.getFullYear()) {
					element.parentElement.classList.add('tile-lembrete-note');
				}
			});
		}
	}

	render() {
		return(
			<div className="container">
				<div className="row" style={{paddingTop: '60px'}}>
					<div className="col-md-4"></div>
					<div className="col-md-4">
						<h2 className="text-center">Meu saldo</h2>
						<p style={{fontSize: '1.35rem'}} className="text-center">R$ {this.state.saldo.toFixed(2)}</p>
					</div>
				</div>
				<div style={{marginTop: '50px'}} className="row">
					<div className="col-md-1"></div>
					<div className="col-md-5">
						<Calendar 
							value={this.state.date}
							onChange={value => this.onChange(value)}
							tileClassName={'tile-lembrete'}
							onActiveDateChange={() => this.configuraCalendario()}
						/>
					</div>
					<div className="col-md-6 menu-calendario">
						<h3 style={{marginBottom: '20px'}}>Lembretes:</h3>
						{this.state.lembretes.map(lembrete => {
							let dataLembrete = new Date(lembrete.data).setHours(0, 0, 0, 0);
							let dataCalendario = this.state.date.setHours(0, 0, 0, 0);

							if (dataLembrete === dataCalendario) {
								return(
									<div key={lembrete.id} className="row" style={{paddingLeft: '30px', marginBottom: '3px'}}>
										<i className="fas fa-caret-right" style={{marginRight: '5px'}}></i>
										<h6>{lembrete.nome}</h6>
									</div>
								)
							} else {
								return(
									<div key={lembrete.id}></div>
								)
							}
						})}
					</div>
				</div>
				<div style={{marginTop: '50px', marginBottom: '50px'}} className="row">
					<div className="col-md-5" style={{paddingTop: '20px'}}>
						<Doughnut
							data={this.state.chartData}
							width={200}
							options={{
								title: {
									display: true,
									text: 'Despesas',
									fontSize: 25
								}
							}}
						/>
					</div>
					<div className="col-md-7" style={{paddingTop: '20px'}}>
						<Line
							data={this.state.faturamentoData}
							height={180}
							options={{
								title: {
									display: true,
									text: 'Faturamento',
									fontSize: 25
								}
							}}
						/>
					</div>
				</div>
			</div>
		);
	}
}