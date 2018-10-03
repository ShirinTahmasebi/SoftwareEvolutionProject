module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  networks: {
  	ropsten: {
  		provider: function() {
  			const HDWalletProvider = require('truffle-hdwallet-provider');
  			return new HDWalletProvider(
  				'media actress spike general shoot uniform absorb album because senior obvious warfare',
  				'https://ropsten.infura.io/v3/ef081d851dea4cdb8a897d5e970405d6'
  			);
  		}, 
  		gasPrice: 25000000000,
  		network_id: 3
  	},
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
