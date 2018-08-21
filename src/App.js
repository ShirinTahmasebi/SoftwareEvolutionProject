import React, { Component } from 'react'
import MemberManager from '../build/contracts/MemberManager.json'
import getWeb3 from './utils/getWeb3'
import SignUp from './SignUp'
import Login from './Login'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      accounts: null,
      memberManagerInstance: null,
      openLogin: false,
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {

    const contract = require('truffle-contract');
    const memberManager = contract(MemberManager);
    memberManager.setProvider(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      // When memberManager has been deployed, do ...
      memberManager.deployed().then((memManagerInstance) => {
        this.setState({accounts});
        this.setState({memberManagerInstance:memManagerInstance});
      });
    })
  }
  
  openLoginPage = (openLogin) => {
    this.setState({openLogin});
  }

  setIsMemberLoggedIn = (isMemberLoggedIn) => {
    this.setState({isMemberLoggedIn});
  }

  getSimpleHeader = () => {
    return (
      <div className="header row">
          <div className="col-xs-4 header-sections"></div>
          <div className="col-xs-4 header-sections header-title">Application Store</div>
          <div className="col-xs-4 header-sections"></div>
        </div>
      );
  }

  getDeveloperContent = () => {
    return (<div>Developer content</div>);
  }

  getUserContent = () => {
    return (<div>User content</div>);
  }

  getAdminContent = () => {
    return (<div>Admin content</div>);
  }

  render() {
    if (this.state.isMemberLoggedIn) {
      // Show header and appropriate content based on user's role
      const header = this.getSimpleHeader();
      // Fill Content
      let content = null;
      // If it is a developer show list of developed applications
      content = this.getDeveloperContent();
      // If it is a user show list of all developer's applications
      content = this.getUserContent();
      // If it is admin show a list of developers and users
      content = this.getAdminContent();

      return (
        <div>
          {header}
          {content}
        </div>);

    } else if(!this.state.openLogin) {
      // Show signup form and login buttons in header
      return (
        <div>
          <Login 
            memberManagerContract={this.state.memberManagerInstance} 
            accounts={this.state.accounts} 
            openLoginCallback={this.openLoginPage}
            openLoginFlag={this.state.openLogin}
            setIsMemeberLoggedIn={this.setIsMemberLoggedIn}
          />
          <SignUp memberManagerContract={this.state.memberManagerInstance} accounts={this.state.accounts}/>
        </div>
      );
    } else {
      // Show Login form with signup buttons in header
        return (
          <div>
            <Login 
              memberManagerContract={this.state.memberManagerInstance} 
              accounts={this.state.accounts} 
              openLoginCallback={this.openLoginPage}
              openLoginFlag={this.state.openLogin}
              setIsMemeberLoggedIn={this.setIsMemberLoggedIn}
            />
          </div>
        );
    }

  }
}

export default App
