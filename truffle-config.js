const path = require("path")

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // to customize your Truffle configuration!
//   contracts_build_directory: path.join(__dirname, "client/src/contracts")
// }

var HDWalletProvider = require("truffle-hdwallet-provider")
var secrets = require("./secrets")
var mnemonic = secrets.mnemonic
var infuraAccessToken = secrets.infuraAccessToken

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/" + infuraAccessToken
        )
      },
      network_id: 3,
      gas: 4000000
    }
  }
}
