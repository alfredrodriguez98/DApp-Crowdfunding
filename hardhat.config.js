require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("solidity-coverage");
require("hardhat-contract-sizer");
require("@nomiclabs/hardhat-etherscan");

const mnemonic = process.env.MNEMONIC;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  // ==> Plugins Config
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [":ERC20$"],
  },

  etherscan: {
    apiKey: {
      mainnet: process.env.ETHSCAN_API,
      bsc: process.env.BSCSCAN_API,
      polygon: process.env.POLYGON_API,
    },
  },

  // ==> Solidity Config

  solidity: {
    version: "0.8.13",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  // ==> Network Config

  defaultNetwork: "localhost",
  networks: {
    hardhat: {},

    // ==> Local Dev Net

    localhost: {
      url: "http://127.0.0.1:7545",
      //accounts: { mnemonic: mnemonic },
    },

    // ==> Mainnets

    ETH_mainnet: {
      url: process.env.ETH_MAINNET_NOWNODE + process.env.NOWNODES_API,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },

    BSC_mainnet: {
      url: process.env.BSC_MAINNET_NOWNODE + process.env.NOWNODES_API,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },

    SmartBCH_mainnet: {
      url: process.env.SMARTBCH_MAINNET,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },

    Polygon_mainnet: {
      url: process.env.POLYGON_MAINNET,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },

    // ==> Testnets

    ETH_testnet: {
      url: process.env.ETH_TESTNET_NOWNODE + process.env.NOWNODES_API,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },

    BSC_testnet: {
      url: process.env.BSC_TESTNET_NOWNODE,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },

    SmartBCH_testnet: {
      url: process.env.SMARTBCH_TESTNET,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },

    Polygon_testnet: {
      url: process.env.POLYGON_TESTNET,
      accounts: { mnemonic: mnemonic },
      gas: "auto", // Limit the gas to x number.
      gasPrice: "auto", // 25 gwei (in wei) (default: 100 gwei)
    },
  },
};
