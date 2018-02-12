import React, { Component } from 'react';
import '../../assets/css/notificacao.css'

export default class Notificacao extends Component {

	render() {
		let texto = this.props.texto;
		return(
			<div className="container">
				{texto.length > 0 &&				
					<div className={'alert alert-' + this.props.tipoAlerta} role="alert">
						{this.props.texto}
					</div>
				}				
			</div>
		);
	}
}