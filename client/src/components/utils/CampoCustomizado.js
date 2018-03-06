import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export class SelectCustomizado extends Component {

	constructor(props) {
		super(props);
		this.state = {msgErro: '', estilo: {color: '#898e96'}, value: 0};

		this.handleChange = this.handleChange.bind(this);
	};

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

	handleChange(event) {
		this.setState({estilo: {}, value: event.target.value});
	}

	render() {
		return(
			<div className="form-group">
				<label>{this.props.titulo}</label>
				<select style={this.state.estilo} value={this.state.value} name={this.props.nome}
					onChange={this.handleChange} required={this.props.required}
					ref={this.props.referencia} className={this.props.classe + ' form-control'}>
					<option value="0" disabled hidden>{this.props.placeholder}</option>
					{this.props.opcoes.map((opcao) => {
						return <option value={opcao.id} key={opcao.id}>{opcao.descricao}</option>
					})}											
				</select>
				<span className="error">{this.state.msgErro}</span>				
			</div>
		);
	}
}

export class RadioCustomizado extends Component {

	render() {
		return(
			<div className={this.props.classe + " form-check"}>
				<input className="form-check-input" type="radio" name={this.props.nome}
					ref={this.props.referencia}
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
				<input type="checkbox" className="form-check-input" id={this.props.id} ref={this.props.referencia} />
    			<label className="form-check-label" htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
			</div>
		);
	}
}

export class CheckBoxDireitaCustomizado extends Component {

	render() {
		return(
			<div>
				<label htmlFor={this.props.id} style={{float: 'left'}}>{this.props.titulo}</label>
				<div style={{height: '20px', width: '20px', float: 'right'}}>
					<input id={this.props.id} type="checkbox" ref={this.props.referencia} />
				</div>
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

export class SpanErro extends Component {

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
			<span name={this.props.nome} className="error">{this.state.msgErro}</span>
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
					disabled={this.props.disabled}
					ref={this.props.referencia} placeholder={this.props.placeholder} />
				<span className="error">{this.state.msgErro}</span>
			</div>
		);
	}
}