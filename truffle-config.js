module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!


  //네트워크 항목 설정---------------------------------------

  networks: {

    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },

    coverage: {
      host: "localhost",
      network_id: "*",
      port: 7545,         // <-- If you change this, also set the port option in .solcover.js.
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01      // <-- Use this low gas price
    },

  },
  //-----------------------------------------------------
  // 테스트 실행시 가스 항목 보여준다. (HD WALLET 연동 후, 랍스텐 실행시, 연동 안된다.)
  mocha: {
    reporter: 'eth-gas-reporter',

    reporterOption: {
      currency: 'KRW',
      gasPrice: 20
    }
  }
};
