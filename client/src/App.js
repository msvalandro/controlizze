import React, { Component } from 'react';
import Header from './components/Header';

class App extends Component {

	primeiroAcesso() {
		// fazer requisição para rota que verifica se usuário já tem empresa cadastrada
		// caso tenha, segue fluxo para home, caso não tenha, renderiza cadastroEmpresa
		return false;
	}

	render() {
		return(
			<div id="root">
				{this.primeiroAcesso() &&
					<div id="main" className="main">
						<p>Desculpe, ainda não tenho nada para exibir nesta página. :(</p>
					</div>
				}
				<Header />
			</div>
		);
	}
}

export default App;