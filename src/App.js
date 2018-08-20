import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import MemberManager from '../build/contracts/MemberManager.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'
import SignUp from './SignUp'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      buffer: null,
      ipfsHash: '',
      accounts: null,
      memberManagerInstance: null,
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

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
    const simpleStorage = contract(SimpleStorageContract);
    const memberManager = contract(MemberManager);
    simpleStorage.setProvider(this.state.web3.currentProvider);
    memberManager.setProvider(this.state.web3.currentProvider);

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      // When simpleStorage has been deployed, do ...
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance;
        this.setState({accounts});
        return this.simpleStorageInstance.get.call(accounts[0])
      }).then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
      // When memberManager has been deployed, do ...
      memberManager.deployed().then((memManagerInstance) => {
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
