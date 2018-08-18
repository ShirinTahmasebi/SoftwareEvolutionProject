import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

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
      ipfsHash: ''
    }

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    // const contract = require('truffle-contract')
    // const simpleStorage = contract(SimpleStorageContract)
    // simpleStorage.setProvider(this.state.web3.currentProvider)

    // // Declaring this for later so we can chain functions on SimpleStorage.
    // var simpleStorageInstance

    // // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     simpleStorageInstance = instance

    //     // Stores a given value, 5 by default.
    //     return simpleStorageInstance.set(5, {from: accounts[0]})
    //   }).then((result) => {
    //     // Get the value from the contract to prove it worked.
    //     return simpleStorageInstance.get.call(accounts[0])
    //   }).then((result) => {
    //     // Update state with the result.
    //     return this.setState({ storageValue: result.c[0] })
    //   })
    // })
  }

  onChange(event){
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    const that = this;
    reader.onload = function(event) {
      // The file's text will be printed here
      that.setState({buffer: Buffer(reader.result)});
      console.log(that.state.buffer);
    };
  }

  onSubmit(event){
    event.preventDefault();
    ipfs.files.add(this.state.buffer,  (error, result) => {
      if (error) {
        console.error(`onSubmit ipfs.add error is ${error}`);
        return;
      }

      this.setState({ipfsHash: result[0].hash});
      console.log(`ipfs hash is ${this.state.ipfsHash}`);
    });
  }
  

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Applicatoin Store</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Your Image</h1>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h1>Upload Your Image</h1>
              <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.onChange}/>
                <input type='submit'/>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
