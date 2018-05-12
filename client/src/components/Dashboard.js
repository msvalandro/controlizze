import React, { Component } from 'react';

export default class Dashboard extends Component {

	constructor() {
		super();
		this.state = {
			lancamentos: [],
			saldo: 0
		}
	}

	componentWillReceiveProps() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.props.empresa !== null) {
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
						this.calculaSaldo();
					});
		}
	}

	calculaSaldo() {
		let saldo = 0;

		this.state.lancamentos.forEach(l => {
			console.log(l);
			if (l.tipolancamentoId === 1) {
				saldo += parseFloat(l.valor);
		console.log(saldo);
				
			} else {
				saldo -= parseFloat(l.valor);
		console.log(saldo);
				
			}
		});
		console.log(saldo);
		
		this.setState({saldo});
	}

	render() {
		return(
			<div className="container">
				<div className="absolut-center">
					<h2 className="text-center">Meu saldo</h2>
					<p style={{fontSize: '1.35rem'}} className="text-center">R$ {this.state.saldo.toFixed(2)}</p>
				</div>
			</div>
		);
	}
}