import React, { Component } from 'react'

import './Login.css'

class Login extends Component {

	loginClicked = (event) => {
		this.props.openLoginCallback(true);
		if (event.target.id === "developerLogin") {
			this.setState({isDeveloperLogin: true});
		} else {
			this.setState({isDeveloperLogin: false});
		}
	}

	signUpClicked = () => {
		this.props.openLoginCallback(false);
	}

	handleInputChanged = (event) => {
		const value = (event.target.type === 'checkbox')? event.target.checked:event.target.value;
		this.setState({
      		[event.target.id]: value
    	});
	}

	onSubmit = (event) => {
		event.preventDefault();
		if (this.props.memberManagerContract  && this.props.accounts) {

			let getMemeberIdByUsernameFunctoin;
			
			if(this.state.isDeveloperLogin){
				// Check if there is a developer with the enterd username and password
				// If there is a developer with specified information then Login!
				getMemeberIdByUsernameFunctoin = this.props.memberManagerContract.getDeveloperIdByUsername;
			} else {
				// Check if there is a developer with the enterd username and password
				// If there is a developer with specified information then Login!
				getMemeberIdByUsernameFunctoin = this.props.memberManagerContract.getUserIdByUsername;
			}
			
			getMemeberIdByUsernameFunctoin(this.state.username).then((memberId) => {
				this.loginCheckingProcessStep1(memberId);
			});				
		} 	
	}

	appropriateError = () => {
		alert(`No member found with username = ${this.state.username} and entered password`);
		return null;
	}


	loginCheckingProcessStep1 = (memberId) => {
		if(memberId == 0) {
			// No member found with this id
			return this.appropriateError();
		}

		let getMemberById;
		if (this.state.isDeveloperLogin) {
			// Contract not null check has been done in parent method
			getMemberById = this.props.memberManagerContract.developers;
		} else {
			// Contract not null check has been done in parent method
			getMemberById = this.props.memberManagerContract.users;
		}

		getMemberById(memberId).then((member) => {
			this.loginCheckingProcessStep2(member);
		});
	}

	loginCheckingProcessStep2 = (member) => {
		// In the next line == was intentionally used instead of === (Because as far as I am concered the id is returned neither as string nor as integer)
		if(!member || (member[0] == 0 && member[1] === '' && member[2] === '')) {
			// No member was found
			return this.appropriateError();
		}						
		let isMemberCredentialsValid = (member[1] === this.state.username && member[2] === this.state.password);
		this.props.setIsMemeberLoggedIn(
			isMemberCredentialsValid, 
			(isMemberCredentialsValid)? ((this.state.isDeveloperLogin) ? 1: 2): 0,
			member[0]
			);

		if (!isMemberCredentialsValid) {
			return this.appropriateError();
		}
	}

	render() {
		if (!this.props.openLoginFlag) {
			return (
				<div className="header row">
					<div className="col-xs-4 header-sections"></div>
					<div className="col-xs-4 header-sections header-title">Application Store</div>
					<div className="col-xs-4 header-sections header-login">
						<input 
							type="button" 
							className="login-button btn btn-default btn-lg" 
							value="Developer Login" 
							onClick={this.loginClicked}
							id="developerLogin"
						/> 
						<input 
							type="button" 
							className="login-button btn btn-default btn-lg" 
							value="User Login" 
							onClick={this.loginClicked}
							id="userLogin"
						/> 
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<div className="header row">
						<div className="col-xs-4 header-sections"></div>
						<div className="col-xs-4 header-sections header-title">Application Store</div>
						<div className="col-xs-4 header-sections header-login">
							<input type="button" className="login-button btn btn-default btn-lg" value="Sign up" onClick={this.signUpClicked}/> 
						</div>
					</div>
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
				<input type="submit" className="btn btn-success btn-lg input-field"/>
			</form>
		);
	}
}

export default Login;