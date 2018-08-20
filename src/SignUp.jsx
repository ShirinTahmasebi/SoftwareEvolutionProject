import React, { Component } from 'react'

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
		
		console.log(`${this.state.username}\n${this.state.password}\n${this.state.isDeveloper}`);
		
		if (!this.state.username || !this.state.password) {
			alert("Fill the fields and try again!");
			return;
		}  
		
		// Save to blockchain
		if (this.props.memberManagerContract  && this.props.accounts) {
			if (this.state.isDeveloper) {
				console.log('SignUp developer');
				this.props.memberManagerContract.signUp(this.state.username, this.state.password, true, { from: this.props.accounts[0]}).then(() => {
        			console.log(`Successdul developer signUp`);
      			});
			} else {
				console.log('SignUp user');
				this.props.memberManagerContract.signUp(this.state.username, this.state.password, false, { from: this.props.accounts[0]}).then(() => {
        			console.log(`uccessdul user signUp`);
      			});
			}
		}
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