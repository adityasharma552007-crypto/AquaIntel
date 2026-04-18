const hre = require("hardhat");
const { ethers } = hre;
require("dotenv").config({ path: ".env", override: true });

async function main() {
  const rpcUrl = hre.network.config.url;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY.startsWith("0x")
    ? process.env.DEPLOYER_PRIVATE_KEY
    : `0x${process.env.DEPLOYER_PRIVATE_KEY}`;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const deployer = new ethers.Wallet(privateKey, provider);
  const artifact = await hre.artifacts.readArtifact("AquaIntel");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);

  const aquaIntel = await factory.deploy();
  await aquaIntel.waitForDeployment();

  const contractAddress = await aquaIntel.getAddress();
  console.log("Deployer:", deployer.address);
  console.log("AquaIntel deployed to:", contractAddress);
  console.log("Copy this to your .env file");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
