/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  solidity: "0.8.9",
  networks: {
    rinkeby: {
      url: `${process.env.RINKEBY_RPC_URL}`,
      chainId: 4,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    mainnet: {
      url: `${process.env.MAINNET_RPC_URL}`,
      chainId: 1,
      accounts: [`${process.env.PRIVATE_KEY}`],
    }
  }
};
