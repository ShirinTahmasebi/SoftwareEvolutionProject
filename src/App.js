import React, { Component } from 'react'
import MemberManager from '../build/contracts/MemberManager.json'
import ApplicationManager from '../build/contracts/ApplicationManager.json'
import getWeb3 from './utils/getWeb3'
import SignUp from './SignUp'
import Login from './Login'
import DeveloperConsole from './DeveloperConsole'
import UserConsole from './UserConsole'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      accounts: null,
      memberManagerInstance: null,
      applicationManagerInstance: null,
      openLogin: false,
      isMemberLoggedIn: false,
      roleNumber: 0, // 0 for guest, 1 for developer, 2 for users, 3 for admin
      memberId: 0, // It can be id of a user of a develoer - Role is stored in roleNumber
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
    const applicationManager = contract(ApplicationManager);
    memberManager.setProvider(this.state.web3.currentProvider);
    applicationManager.setProvider(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.setState({accounts});
      // When memberManager has been deployed, do ...
      memberManager.deployed().then((memManagerInstance) => {
        this.setState({memberManagerInstance:memManagerInstance});
      });

      // When applicationManager has been deployed, do ...
      applicationManager.deployed().then((appManagerInstnace) => {
        this.setState({applicationManagerInstance:appManagerInstnace});
      });
    })
  }
  
  openLoginPage = (openLogin) => {
    this.setState({openLogin});
  }

  setIsMemberLoggedIn = (isMemberLoggedIn, roleNumber, memberId) => {
    // Role number = 0 for guest, 1 for developer, 2 for users, 3 for admin
    this.setState({isMemberLoggedIn, roleNumber, memberId});
  }

  getSimpleHeader = () => {
    return (
      <div className="header row">
          <div className="col-xs-4 header-sections"/>
          <div className="col-xs-4 header-sections header-title">Application Store</div>
          <div className="col-xs-4 header-sections"/>
        </div>
      );
  }

  getDeveloperContent = () => {
    return (
      <DeveloperConsole 
        memberManagerContract={this.state.memberManagerInstance} 
        applicationManagerContract={this.state.applicationManagerInstance} 
        accounts={this.state.accounts}
        memberId={this.state.memberId} 
      />
    );
  }

  getUserContent = () => {
    return (
        <UserConsole 
          memberManagerContract={this.state.memberManagerInstance} 
          applicationManagerContract={this.state.applicationManagerInstance} 
          accounts={this.state.accounts}
          memberId={this.state.memberId}
        />
      );
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
      if (this.state.roleNumber === 1) {
        // If it is a developer show list of developed applications
        content = this.getDeveloperContent();
      } else if (this.state.roleNumber === 2) {
        // If it is a user show list of all developer's applications
        content = this.getUserContent();
      } else if (this.state.roleNumber === 3) {
        // If it is admin show a list of developers and users
        content = this.getAdminContent();
      } else {
        // Probabely user has not logged in !
      }

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
