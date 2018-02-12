import { Component } from 'react';

class Logout extends Component {

    componentWillMount() {        
        localStorage.removeItem('auth-token');
		this.props.history.push('/');
	}

    render() {
        return null;
    }
}

export default Logout;