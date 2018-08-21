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
				this.props.memberManagerContract.signUp(this.state.username, this.state.password, true, { from: this.props.accounts[0]}).then(() => {
        			console.log(`Successdul developer signUp`);
      			});
			} else {
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

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-xs-4"></div>
					<div className="col-xs-4 body-sections">
						{this.getFormHtml()}
					</div>
					<div className="col-xs-4"></div>
				</div>
				
			</div>
			);
	}

	getFormHtml = () => {
		return (
			<form onSubmit={this.onSubmit} className="form-container">
				<div className="input-field"> 
					<div className="form-group">
						<label htmlFor="username">Username:</label>
						<input 
							type="text" 
							className="form-control" 
							id="username" 
							onChange={this.handleInputChanged}
						/>
					</div>
				</div>
				<div className="input-field"> 
					<div className="form-group">
						<label htmlFor="password">Password:</label>
						<input 
							type="password" 
							className="form-control" 
							id="password" 
							onChange={this.handleInputChanged}
						/>
					</div>

				</div>
				<div className="input-field">
					<div className="checkbox input-field">
						<input type="checkbox" id="isDeveloper" onChange={this.handleInputChanged}/>
						<label htmlFor="isDeveloper">I am a developer!</label>
					</div>
					<br/>
				</div>
				<input type="submit" className="btn btn-success btn-lg input-field"/>
			</form>
		);
	}

}

export default SignUp;