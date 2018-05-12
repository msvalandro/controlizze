import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { SubmitCustomizado } from './utils/CampoCustomizado';

export default class Lancamentos extends Component {

	constructor() {
		super();
		this.state = {
			lancamentos: [],
			lancamentosDoMes: [],
			mesLancamento: '',
			saldoMes: 0,
			tipoAlerta: '',
			msg: ''
		};
	}

	componentWillReceiveProps() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.props.empresa.id !== undefined) {
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
					this.eventosLancamento();
					this.lancamentosPorMes();
				});			
		}
	}

	eventosLancamento() {
		let data = new Date(this.props.empresa.data);

		$('#prev').click(() => {
			data.setMonth(data.getMonth() - 1);
			this.lancamentosPorMes(data);
		});
		$('#next').click(() => {
			data.setMonth(data.getMonth() + 1);
			this.lancamentosPorMes(data);
		});
	}

	lancamentosPorMes(dataBase = new Date(this.props.empresa.data)) {
		let lancamentosDoMes = [];
		let saldoMes = 0;

		this.state.lancamentos.forEach(l => {
			let d = new Date(l.data);
			if (d.getMonth() + 1 === dataBase.getMonth() + 1 && d.getFullYear() === dataBase.getFullYear()) {
				lancamentosDoMes.push(l);
				if (l.tipolancamentoId === 1) {
					saldoMes += parseFloat(l.valor);
				} else {
					saldoMes -= parseFloat(l.valor);
				}
			}
		});

		this.setState({lancamentosDoMes});
		this.setState({saldoMes});
		this.setState({mesLancamento: `${(dataBase.getMonth() > 8 ? '' : '0') + (dataBase.getMonth() + 1)}/${dataBase.getFullYear()}`});
	}

	formataData(date) {
		let data = new Date(date);
		let dia = data.getDate();
		let mes = data.getMonth() + 1;
		let ano = data.getFullYear();

		return `${(dia > 9 ? '' : '0') + dia}/${(mes > 9 ? '' : '0') + mes}/${ano}`;
	}

	exclui(id) {
		const requestInfo = {
			method: 'DELETE',
			body: JSON.stringify({id: id}),
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		let linha = $('#exclui-lancamento-' + id).closest('tr');

		fetch(`http://localhost:8080/api/lancamento/${id}/${this.props.empresa.id}`, requestInfo)
			.then(response => {
				if (response.ok) {
					linha.fadeOut(400);
					setTimeout(() => {
						linha.remove();
					}, 400);
					this.setState({lancamentos: this.state.lancamentos.filter(l => l.id !== id)});
					this.lancamentosPorMes(new Date(this.state.lancamentosDoMes.find(l => l.id === id).data));
				} else {
					throw new Error('Não foi possível deletar o usuário do sistema.');
				}
			})
			.catch(error => console.log('Ocorreu um erro ao excluir o cadastro do sistema.'));
	}

	render() {
		return(
			<div className="container">
				<div id="mes-lancamento" className="row">
					<div id="prev"><i className="fas fa-2x fa-chevron-left"></i></div>
					<div className="col-md-8">
						<h1 className="text-center">Lançamentos {this.state.mesLancamento}</h1>
					</div>
					<div id="next"><i className="fas fa-2x fa-chevron-right"></i></div>
				</div>
				<div className="table-responsive">
					<table className="table table-hover">
						<thead>
							<tr>
								<th scope="col">Data</th>
								<th scope="col">Descrição</th>
								<th scope="col">Tipo</th>								
								<th scope="col">Documento</th>
								<th scope="col">Valor</th>
								<th scope="col"></th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody>
							{this.state.lancamentosDoMes.map(lancamento => {
								return(
									<tr key={lancamento.id}>
										<td>{this.formataData(lancamento.data)}</td>
										<td>{lancamento.descricao}</td>
										<td>{lancamento.tipolancamento.descricao}</td>										
										<td>{lancamento.numeronf}</td>
										<td>{lancamento.valor}</td>
										<td>
											<Link to={{pathname: '/lancamento/edit', state: {id: lancamento.id}}}>
												<SubmitCustomizado className="btn btn-success" 
												valor="edita" titulo="Editar" />
											</Link>
										</td>
										<td>
											<SubmitCustomizado id={"exclui-lancamento-" + lancamento.id} acao={() => this.exclui(lancamento.id)} 
												className="btn btn-danger" valor="exclui" titulo="Excluir" />
										</td>									
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				<div style={{height: '35px'}}>
					<div style={{float: 'right', marginRight: '50px', marginTop: '10px'}}>
						<span style={{color: '#434a51'}} className="font-semibold">Saldo do Mês: {this.state.saldoMes.toFixed(2)}</span>
					</div>
				</div>
			</div>
		);
	}
}