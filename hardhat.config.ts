import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  paths: {
    artifacts: './pages/api/artifacts',
    sources: './pages/api/contracts',
    cache: './pages/api/cache',
    tests: './pages/api/test',
  },
};

export default config;
