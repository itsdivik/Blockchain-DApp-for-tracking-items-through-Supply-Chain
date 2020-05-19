const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "257ef24dcbaa4057bde1cacde6cf9565";
const mnemonic = "rebel salad visit never tattoo chuckle skate south system coral connect paddle";
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
        network_id: 4,
        gas: 4500000,
        gasPrice: 10000000000
    },
  }
};