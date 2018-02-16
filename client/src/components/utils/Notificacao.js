import React, { Component } from 'react';
import '../../assets/css/notificacao.css'

export default class Notificacao extends Component {

	componentDidMount() {

	}

	render() {
		return(
			<div id={this.props.id} className="container" style={{display: 'hide'}}>
				{this.props.texto.length > 0 &&				
					<div style={this.props.estilo} className={'alert alert-' + this.props.tipoAlerta} role="alert">
						{this.props.texto}
					</div>
				}				
			</div>
		);
	}
}