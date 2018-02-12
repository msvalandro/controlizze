import React, { Component } from 'react';

export class TextAreaCustomizado extends Component {

	render() {
		return(
			<div className="form-group">
				<label htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
				<textarea id={this.props.id} required={this.props.required}
					ref={this.props.referencia}
					rows={this.props.linha} cols={this.props.coluna} 
					className="form-control" placeholder={this.props.placeholder}></textarea>
			</div>
		);
	}
}

export class SubmitCustomizado extends Component {

	render() {
		return(
			<div className="form-group">
				<button type={this.props.tipo} className={this.props.className}>{this.props.titulo}</button>
			</div>
		);
	}
}

export default class InputCustomizado extends Component {

	render() {
		return(
			<div className={'form-group ' + this.props.className}>
				<label htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
				<input type={this.props.tipo} className="form-control" id={this.props.id} required={this.props.required}
					ref={this.props.referencia} placeholder={this.props.placeholder} />
			</div>
		);
	}
}