import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Notificacao from './utils/Notificacao';
import { SubmitCustomizado } from './utils/CampoCustomizado';

export default class Lembretes extends Component {

	constructor() {
		super();
		this.state = {
			lembretes: [],
			msg: '',
			tipoAlerta: 'danger'
		};
	}

	componentWillReceiveProps() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.props.empresa.id !== undefined) {
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
			body: JSON.stringify({id: id}),
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		let linha = $('#exclui-lembrete-' + id).closest('tr');

		fetch(`http://localhost:8080/api/lembrete/${id}/${this.props.empresa.id}`, requestInfo)
			.then(response => {
				if (response.ok) {
					linha.fadeOut(400);
					setTimeout(() => {
						linha.remove();
					}, 400);
					this.setState({msg: 'Dados excluídos com sucesso.', tipoAlerta: 'success'});
					$('#notificacao-lembretes').show();				
					setTimeout(() => {
						$('#notificacao-lembretes').fadeOut(1000);						
					}, 2000);
					this.setState({lembretes: this.state.lembretes.filter(l => l.id !== id)});
				} else {
					throw new Error('Não foi possível deletar o lembrete do sistema.');
				}
			})
			.catch(error => console.log('Ocorreu um erro ao excluir o cadastro do sistema.'));
	}

	render() {
		return(
			<div className="container">
				<Notificacao id="notificacao-lembretes" estilo={{marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />				
				<div style={{marginTop: '20px', marginBottom: '40px'}} className="row">
					<div className="col-md-12">
						<h1 className="text-center">Lembretes</h1>
					</div>
				</div>
				<div className="table-responsive">
					<table className="table table-hover">
						<thead>
							<tr>
								<th scope="col">Data</th>
								<th scope="col">Nome</th>
								<th scope="col">Descrição</th>
								<th scope="col"></th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody>
							{this.state.lembretes.map(lembrete => {
								return(
									<tr key={lembrete.id}>
										<td>{this.formataData(lembrete.data)}</td>
										<td>{lembrete.nome}</td>
										<td>{lembrete.descricao}</td>
										<td>
											<Link to={{pathname: '/lembrete/edit', state: {id: lembrete.id}}}>
												<SubmitCustomizado className="btn btn-outline-success" 
												valor="edita" titulo={<i className="far fa-edit"></i>} />
											</Link>
										</td>
										<td>
											<SubmitCustomizado id={"exclui-lembrete-" + lembrete.id} acao={() => this.exclui(lembrete.id)} 
												className="btn btn-outline-danger" valor="exclui" titulo={<i className="far fa-trash-alt"></i>} />
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