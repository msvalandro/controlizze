import React, { Component } from 'react';

export default class InputSubmitCustomizado extends Component {

	render() {
		return(
			<div className="form-group">
				<button type={this.props.tipo} className={this.props.className}>{this.props.titulo}</button>
			</div>
		);
	}
}