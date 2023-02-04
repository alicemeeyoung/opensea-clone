import path from 'path';
import { artifacts, ethers } from 'hardhat';
import type { Contract } from 'ethers';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const NFT = await ethers.getContractFactory('NFT');
  const nft = await NFT.deploy();

  // For each contract, pass the deployed contract and name to this function to save a copy of the contract ABI and address to the front end.
  saveFrontendFiles(nft, 'NFT');
}

function saveFrontendFiles(contract: Contract, name: string) {
  const fs = require('fs');

  // TODO: the path name may need to be updated
  const contractsDir = path.join(__dirname, '/../../contracts-data');

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
