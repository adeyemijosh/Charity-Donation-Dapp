module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Localhost (default: none)
      port: 7545,         // Ganache GUI default port
      network_id: "*",    // Match any network ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",  // Specify the Solidity compiler version
    },
  },
};
