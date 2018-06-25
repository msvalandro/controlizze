import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import TratadorErros from './utils/TratadorErros';
import Notificacao from './utils/Notificacao';
import InputCustomizado, { SubmitCustomizado } from './utils/CampoCustomizado';

export default class Categoria extends Component {

	constructor() {
		super();
		this.state = {
			id: 0,
			msg: '',
			tipoAlerta: 'danger',
			categorias: []
		};
	}

	componentWillReceiveProps() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.props.empresa !== null) {
			fetch(`http://localhost:8080/api/categorias/empresa/${this.props.empresa.id}`, requestInfo)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Não foi possível acessar os dados do sistema.');
					}
				})
				.then(categorias => {
					this.setState({categorias});
				});
		}
	}

	envia(event) {
		event.preventDefault();
		
		const requestInfo = {
			headers: new Headers({
				'Content-Type': 'application/json',
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		if (this.state.id === 0) {
			requestInfo.method = 'POST';
			requestInfo.body = JSON.stringify({descricao: this.descricao.input.value, empresaId: this.props.empresa.id});
		} else {
			requestInfo.method = 'PUT';
			requestInfo.body = JSON.stringify({id: this.state.id, descricao: this.descricao.input.value, empresaId: this.props.empresa.id});
		}

		fetch('http://localhost:8080/api/categorias', requestInfo)
			.then(response => {
				PubSub.publish('limpa-erros', {});
				if (response.ok) {
					return response.json();
				} else if (response.status === 400) {
					new TratadorErros().publicaErros(response.json());
				} else {
					this.setState({msg: 'Ocorreu um erro ao gravar a categoria.', tipoAlerta: 'danger'});
					throw new Error('Não foi possível cadastrar a categoria no sistema.');
				}
			})
			.then(result => {
				if (Array.isArray(result)) {
					let categorias = this.state.categorias.filter(c => c.id !== result[1][0].id);
					categorias.push(result[1][0]);
					this.setState({categorias});
					this.setState({msg: 'Dados gravados com sucesso.', tipoAlerta: 'success'});
					$('#notificacao-categoria').show();				
					setTimeout(() => {
						$('#notificacao-categoria').fadeOut(1000);						
					}, 2000);
					this.setState({id: 0});					
					this.limpaForm();
				} else if (result !== undefined) {
					let categorias = this.state.categorias;
					categorias.push(result);
					this.setState({categorias});
					this.setState({msg: 'Dados gravados com sucesso.', tipoAlerta: 'success'});
					$('#notificacao-categoria').show();				
					setTimeout(() => {
						$('#notificacao-categoria').fadeOut(1000);						
					}, 2000);
					this.limpaForm();
				}
			})
			.catch(error => console.log(error));
	}

	edita(id, descricao) {
		this.setState({id});
		this.descricao.input.value = descricao;
	}

	exclui(id) {
		const requestInfo = {
			method: 'DELETE',
			body: JSON.stringify({id: id}),
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		let linha = $('#exclui-categoria-' + id).closest('tr');

		fetch(`http://localhost:8080/api/categorias/${id}`, requestInfo)
			.then(response => {
				if (response.ok) {
					this.setState({id: 0});
					linha.fadeOut(400);
					setTimeout(() => {
						linha.remove();
					}, 400);
					this.setState({categorias: this.state.categorias.filter(c => c.id !== id)});
					this.setState({msg: 'Categoria excluída com sucesso.', tipoAlerta: 'danger'});
					$('#notificacao-categoria').show();				
					setTimeout(() => {
						$('#notificacao-categoria').fadeOut(1000);						
					}, 2000);
				} else {
					throw new Error('Não foi possível deletar a categoria do sistema.');
				}
			})
			.catch(() => {
				this.setState({msg: 'Já existem lançamentos vinculados a esta categoria.', tipoAlerta: 'danger'});
				setTimeout(() => {
					$('#notificacao-categoria').fadeOut(1000);						
				}, 2000);
			});
	}

	limpaForm() {
		this.descricao.input.value = '';
	}

	render() {
		return(
			<div className="container">
				<Notificacao id="notificacao-categoria" estilo={{marginBottom: '10px'}} tipoAlerta={this.state.tipoAlerta} texto={this.state.msg} />
				<h1 style={{paddingTop: '20px', marginBottom: '40px'}} 
					className="text-center">Categorias</h1>
				<div className="row">			
					<div className="col-md-2"></div>
					<form className="col-md-8" onSubmit={this.envia.bind(this)}>
						<div className="row">
							<InputCustomizado className="col-md-12" htmlFor="descricao-categoria"
								titulo="Descrição" tipo="text" id="descricao-categoria" 
								required="true" nome="descricaoCategoria"
								referencia={(input) => this.descricao = input} />
						</div>
						<div className="form-group" style={{marginTop: '20px'}}>
							<SubmitCustomizado estilo={{width: '100%'}} tipo="submit"
								className="btn btn-success" valor="salva" titulo="Salvar" />
						</div>
					</form>
				</div>
				<div className="table-responsive" style={{marginTop: '30px'}}>
					<table className="table table-hover">
						<thead>
							<tr>
								<th width="85%" scope="col">Descrição</th>
								<th scope="col"></th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody>
							{this.state.categorias.map(categoria => {
								return(
									<tr id={"linha-categoria-" + categoria.id} key={categoria.id}>
										<td>{categoria.descricao}</td>
										<td>
											<SubmitCustomizado className="btn btn-success" acao={() => this.edita(categoria.id, categoria.descricao)}
												valor="edita" titulo="Editar" />
										</td>
										<td>
											<SubmitCustomizado id={"exclui-categoria-" + categoria.id} acao={() => this.exclui(categoria.id)} 
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