import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './assets/css/reset.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../src/assets/css/fontawesome-all.min.css';
import '../src/assets/css/main.css';
import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';
import CadastroUsuario from './components/CadastroUsuario';
import Perfil from './components/Perfil';
import Empresa from './components/Empresa';
import Lancamento from './components/Lancamento';
import Lancamentos from './components/Lancamentos';
import Dashboard from './components/Dashboard';
import Categoria from './components/Categoria';
import registerServiceWorker from './registerServiceWorker';

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
			<Route exact path="/" render={props => (verificaAutenticacao(<App {...props} children={<Dashboard {...props}/>} />))} />
			<Route path="/login" render={props => 
				localStorage.getItem('auth-token') === null ? <Login {...props} /> : <Redirect to="/" />} />
			<Route path="/logout" component={Logout} />
			<Route path="/usuario/novo" component={CadastroUsuario} />
			<Route path="/perfil" render={props => (verificaAutenticacao(<App {...props} children={<Perfil {...props}/>} />))} />
			<Route path="/lancamento" render={props => (verificaAutenticacao(<App {...props} children={<Lancamento {...props}/>} />))} />
			<Route path="/lancamentos" render={props => (verificaAutenticacao(<App {...props} children={<Lancamentos {...props}/>} />))} />			
			<Route path="/empresa" render={props => (verificaAutenticacao(<App {...props} children={<Empresa {...props}/>} />))} />			
			<Route path="/categoria" render={props => (verificaAutenticacao(<App {...props} children={<Categoria {...props}/>} />))} />			
			<Route path="/*" render={() => (<Redirect to={'/'}/>)} />				
		</Switch>
	</Router>)
	, document.getElementById('root'));
registerServiceWorker();