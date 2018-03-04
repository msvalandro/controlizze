import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export class RadioCustomizado extends Component {

	render() {
		return(
			<div className={this.props.classe + " form-check"}>
				<input className="form-check-input" type="radio" name={this.props.nome} 
					id={this.props.id} value={this.props.valor} required={this.props.required} />
				<label className="form-check-label" htmlFor={this.props.id}>{this.props.titulo}</label>
			</div>
		);
	}
}

export class CheckBoxCustomizado extends Component {

	render() {
		return(
			<div className="form-check">
				<input type="checkbox" className="form-check-input" id={this.props.id} />
    			<label className="form-check-label" htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
			</div>
		);
	}
}

export class TextAreaCustomizado extends Component {

	constructor() {
		super();
		this.state = {msgErro: ''};
	}

	componentDidMount() {
		PubSub.subscribe('erro-validacao', (topico, erro) => {
			if (erro.field === this.props.nome) {
				this.setState({msgErro: erro.message});	
			}
		});

		PubSub.subscribe('limpa-erros', topico => {
			this.setState({msgErro: ''});
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe('erro-validacao');
		PubSub.unsubscribe('limpa-erros');
	}

	render() {
		return(
			<div className="form-group">
				<label htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
				<textarea id={this.props.id} required={this.props.required}
					ref={this.props.referencia}
					rows={this.props.linha} cols={this.props.coluna} 
					className="form-control" placeholder={this.props.placeholder}></textarea>
				<span className="error">{this.state.msgErro}</span>				
			</div>
		);
	}
}

export class SubmitCustomizado extends Component {

	render() {
		return(
			<button onClick={this.props.acao} style={this.props.estilo} type={this.props.tipo} className={this.props.className} value={this.props.valor}>{this.props.titulo}</button>
		);
	}
}

export default class InputCustomizado extends Component {

	constructor() {
		super();
		this.state = {msgErro: ''};
	}

	componentDidMount() {
		PubSub.subscribe('erro-validacao', (topico, erro) => {
			if (erro.field === this.props.nome) {
				this.setState({msgErro: erro.message});	
			}
		});

		PubSub.subscribe('limpa-erros', topico => {
			this.setState({msgErro: ''});
		});
	}

	componentWillUnmount() {
		PubSub.unsubscribe('erro-validacao');
		PubSub.unsubscribe('limpa-erros');
	}

	render() {
		return(
			<div className={'form-group ' + this.props.className}>
				<label htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
				<input type={this.props.tipo} className="form-control" id={this.props.id} 
					required={this.props.required} name={this.props.nome}
					ref={this.props.referencia} placeholder={this.props.placeholder} />
				<span className="error">{this.state.msgErro}</span>
			</div>
		);
	}
}