import React from 'react';
import ReactDOM from 'react-dom';
import './css/reset.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';
import CadastroUsuario from './components/CadastroUsuario';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

function verificaAutenticacao(component) {
    if (localStorage.getItem('auth-token') === null) {
        return <Redirect to={{pathname: '/login'}} />
    } else {
        return component;
    }
}

ReactDOM.render(
	(<Router>
		<Switch>
			<Route exact path="/" render={props => (verificaAutenticacao(<App {...props} />))} />
			<Route path="/login" render={props => 
				localStorage.getItem('auth-token') === null ? <Login {...props} /> : <Redirect to="/" />} />
			<Route path="/logout" component={Logout} />
			<Route path="/usuario/novo" component={CadastroUsuario} />			
		</Switch>
	</Router>)
	, document.getElementById('root'));
registerServiceWorker();