const HDWalletProvider = require('truffle-hdwallet-provider');
const infura = "https://rinkeby.infura.io/v3/56ca96d2f63342adbef85cf565391f71";
const mnemonic = "spirit supply whale amount human item harsh scare congress discover talent hamster";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      websockets: true,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infura),
        network_id: 4,
        gas: 4500000,
        gasPrice: 10000000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  }
};
