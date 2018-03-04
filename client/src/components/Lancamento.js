import React, { Component } from 'react';
import InputCustomizado, { RadioCustomizado } from './utils/CampoCustomizado';

export default class Lancamento extends Component {

	render() {
		return(
			<div className="container">
				<h1 style={{marginTop: '20px', marginBottom: '40px'}} 
					className="text-center">Cadastro de Lançamento</h1>
				<div className="row">
					<div className="col-md-2"></div>
					<form className="row col-md-8">
						<div className="col-md-9">
							<InputCustomizado htmlFor="descricao" titulo="Descrição"
								tipo="text" id="descricao" required="true" nome="descricao"
								referencia={(input) => this.descricao = input} className="col-md-12"
								placeholder="Informe a descrição do lançamento aqui..." />
						</div>
						<div className="col-md-3">
							<label></label>
							<RadioCustomizado titulo="Receita" id="receita"
								required="true" nome="radio-lancamento" classe="radio-lancamento" />
							<RadioCustomizado titulo="Despesa" id="despesa"
								required="true" nome="radio-lancamento" classe="radio-lancamento" />
						</div>
					</form>
				</div>
			</div>
		);
	}
}