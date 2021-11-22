const { version } = require('chai');

require('dotenv').config();
require('hardhat-deploy');
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");

const mnemonic = process.env["MNEMONIC"];
const etherscanApiKey = process.env['ETHERSCAN_API_KEY']
const polyscanApiKey = process.env['POLYSCAN_API_KEY']

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  networks: {
    localhost: {
      url: "http://localhost:8545"
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/31418bbd3fe041febb62054997eac515",
      accounts: {
        mnemonic
      }
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/31418bbd3fe041febb62054997eac515",
      accounts: {
        mnemonic
      }
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/31418bbd3fe041febb62054997eac515",
      accounts: {
        mnemonic
      },
      saveDeployments: true
    },
    mumbai: {
      url: "https://polygon-mumbai.infura.io/v3/31418bbd3fe041febb62054997eac515",
      gasPrice: 1000000000,
      accounts: {
        mnemonic
      },
      saveDeployments: true
    }
  },
  etherscan: {
    apiKey: polyscanApiKey
  },
  solidity: {
    compilers: [
      {
        version: "0.4.24",
      },
      {
        version: "0.5.12",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.8.10",
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          }
        }
      },
    ],
  },
};

