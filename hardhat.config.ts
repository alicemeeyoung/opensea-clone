import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-chai-matchers';

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  paths: {
    artifacts: './backend/artifacts',
    sources: './backend/contracts',
    cache: './backend/cache',
    tests: './backend/test',
  },
};

export default config;
