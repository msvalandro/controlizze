import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../assets/css/header.css';

export default class Header extends Component {

	componentDidMount() {
		$('#items-header li').click(function() {
			$('#items-header li').removeClass('active');

			if (!$(this).hasClass('active')) {
				$(this).addClass('active');
			}
		});

		$('.navbar-brand').click(() => {
			$('.sidebar-nav li').removeClass('active');
		});

		$('#botao-menu').click(() => {
			$('#wrapper').toggle();
		});
	}

	render() {
		return(
			<nav className="navbar navbar-expand-md navbar-dark bg-dark">
				<Link className="navbar-brand" to={'/'}>Controlizze</Link>
				<button id="botao-menu" className="navbar-toggler" type="button" 
					// data-toggle="collapse" data-target="#navbar-conteudo" 
					aria-controls="navbar-conteudo" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbar-conteudo">
					<ul id="items-header" className="navbar-nav mr-auto">
						{/* <li className="nav-item active">
							<Link className="nav-link" to={'/'}>Home <span className="sr-only">(current)</span></Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to={'/lancamento'}>Relatórios</Link>
						</li> */}
					</ul>

					<span>Olá, {this.props.usuario.primeiroNome}</span>

					<ul className="navbar-nav">					
						<li className="nav-item dropdown">
							<Link className="nav-link dropdown-toggle" to={''} id="perfil-dropdown" 
								role="button" data-toggle="dropdown" 
								aria-haspopup="true" aria-expanded="false">
								<i className="far fa-user fa-lg" style={{marginLeft: '20px'}}></i>
							</Link>
							<div className="dropdown-menu dropdown-menu-right" aria-labelledby="perfil-dropdown">
								<Link className="dropdown-item" to={'/perfil'}>Meu perfil</Link>
								<Link className="dropdown-item" to={'/empresa'}>Minha empresa</Link>
								<div className="dropdown-divider"></div>
								<Link className="dropdown-item" to={'/logout'}>Sair</Link>
							</div>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}