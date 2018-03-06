import React, { Component } from 'react';
import Header from './components/Header';
import ModalEmpresa from './components/ModalEmpresa';

class App extends Component {

	constructor() {
		super();
		this.state = {
			usuario: {},
			empresa: {},
			primeiroAcesso: false
		};
	}

	componentWillMount() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/usuarios', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar os dados do sistema.');
				}
			})
			.then(usuario => this.setState({usuario}));

		this.requestEmpresa();
	}

	componentWillReceiveProps() {
		this.setState({primeiroAcesso: false});
		this.requestEmpresa();
	}

	requestEmpresa() {
		const requestInfo = {
			headers: new Headers({
				'Authorization': `bearer ${localStorage.getItem('auth-token')}`
			})
		};

		fetch('http://localhost:8080/api/empresas', requestInfo)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Não foi possível acessar os dados do sistema.');
				}
			})
			.then(empresa => {
				this.setState({empresa});
				this.forceUpdate();
				if (!empresa) {
					this.setState({primeiroAcesso: true});
				}
			});
	}

	render() {
		const { children } = this.props;
    	let childrenWithProps = React.Children.map(children, child =>
      		React.cloneElement(child, { empresa: this.state.empresa }));

		return(
			<div id="root">
				<Header usuario={this.state.usuario} />			
				{this.state.primeiroAcesso &&				
					<ModalEmpresa mostra={this.state.primeiroAcesso}/>
				}
				{childrenWithProps}
				</div>
		);
	}
}

export default App;