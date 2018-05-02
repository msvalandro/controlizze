import React, { Component } from 'react';
import Header from './components/Header';
import SideBar from './components/SideBar';
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
					localStorage.removeItem('auth-token');
					this.props.history.push('/');
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
					localStorage.removeItem('auth-token');
					this.props.history.push('/');
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
				<SideBar />
				<div id="principal" style={{marginLeft: '250px', marginTop: '56px'}}>				
					{this.state.primeiroAcesso &&				
						<ModalEmpresa mostra={this.state.primeiroAcesso}/>
					}
					{childrenWithProps}
				</div>
			</div>
		);
	}
}

export default App;