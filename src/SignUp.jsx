import React, { Component } from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './SignUp.css'

class SignUp extends Component {

	constructor(props) {
		super(props);

		this.state = {
			username: null,
			password: null,
			isDeveloper: false,
		};
	}
	
	onSubmit = (event) => {
		event.preventDefault();
		this.props.memberManagerContract.getUsersCount().then((r) => {
        	console.log(`SignUp.js ${r}`);
      	});
		console.log(`username ${this.state.username}\npassword ${this.state.password}\nisDeveloprt ${this.state.isDeveloper}`);
		// Save to blockchain
	}

	handleInputChanged = (event) => {
		const value = (event.target.type === 'checkbox')? event.target.checked:event.target.value;
		this.setState({
      		[event.target.id]: value
    	});
	}

	getUsersCount = () => {
		this.props.memberManagerContract.usersCount.call();
	}

	render() {
		return (
			<form onSubmit={this.onSubmit}>
				<div className="row input-field"> 
					<div className="form-group col-xs-4">
						<label htmlFor="username">Username:</label>
						<input 
							type="text" 
							className="form-control" 
							id="username" 
							onChange={this.handleInputChanged}
						/>
					</div>
				</div>
				<div className="row input-field"> 
					<div className="form-group col-xs-4">
						<label htmlFor="password">Password:</label>
						<input 
							type="password" 
							className="form-control" 
							id="password" 
							onChange={this.handleInputChanged}
						/>
					</div>

				</div>
				<div className="checkbox input-field">
					<input type="checkbox" id="isDeveloper" onChange={this.handleInputChanged}/> I am a developer!
				</div>
				<br/>
				<input type="submit" className="btn btn-success input-field"/>

				<div>{this.getUsersCount}</div>
			</form>
			);
	}
}

export default SignUp;