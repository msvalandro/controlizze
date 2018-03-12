import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SubmitCustomizado } from './utils/CampoCustomizado';

export default class Lancamentos extends Component {

	constructor() {
		super();
		this.state = {lancamentos: []};
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

	exclui(id) {
		const requestInfo = {
			method: 'DELETE',
			body: JSON.stringify({id: 'id'}),
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch(`http://localhost:8080/api/lancamento/${id}/${this.props.empresa.id}`, requestInfo)
			.then(response => {
				if (response.ok) {
					console.log('excluido');						
				} else {
					throw new Error('Não foi possível deletar o usuário do sistema.');
				}
			})
			.catch(error => console.log('Ocorreu um erro ao excluir o cadastro do sistema.'));
	}

	render() {
		return(
			<div className="container">
				<h1 style={{marginTop: '20px', marginBottom: '40px'}} 
					className="text-center">Lançamentos</h1>
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
							{this.state.lancamentos.map(lancamento => {
								return(
									<tr key={lancamento.id}>
										<td>{this.formataData(lancamento.data)}</td>
										<td>{lancamento.descricao}</td>
										<td>{lancamento.tipolancamento.descricao}</td>										
										<td>{lancamento.numeronf}</td>
										<td>{lancamento.valor}</td>
										<td>
											<Link to={{pathname: '/lancamento', state: {id: lancamento.id}}}>
												<SubmitCustomizado className="btn btn-success" 
												valor="edita" titulo="Editar" />
											</Link>
										</td>
										<td>
											<SubmitCustomizado acao={() => this.exclui(lancamento.id)} 
												className="btn btn-danger" valor="exclui" titulo="Excluir" />
										</td>									
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}