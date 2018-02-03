import React, { Component } from 'react';

export default class InputCustomizado extends Component {

	render() {
		return(
			<div className="form-group">
				<label htmlFor={this.props.htmlFor}>{this.props.titulo}</label>
				<input type={this.props.tipo} className="form-control" id={this.props.id} required={this.props.required}
					ref={this.props.referencia} placeholder={this.props.placeholder} />
			</div>
		);
	}
}