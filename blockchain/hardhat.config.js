require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const rawPrivateKey = process.env.DEPLOYER_PRIVATE_KEY || "";
const sanitizedPrivateKey = rawPrivateKey.startsWith("0x")
  ? rawPrivateKey
  : `0x${rawPrivateKey}`;
const hasValidPrivateKey = /^0x[0-9a-fA-F]{64}$/.test(sanitizedPrivateKey);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: hasValidPrivateKey ? [sanitizedPrivateKey] : [],
    },
  },
};
