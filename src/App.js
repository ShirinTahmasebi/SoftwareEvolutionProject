import React, { Component } from 'react'
import MemberManager from '../build/contracts/MemberManager.json'
import getWeb3 from './utils/getWeb3'
import SignUp from './SignUp'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      accounts: null,
      memberManagerInstance: null,
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
  

  render() {
    return (
      <SignUp memberManagerContract={this.state.memberManagerInstance} accounts={this.state.accounts}/>
    );
  }
}

export default App
