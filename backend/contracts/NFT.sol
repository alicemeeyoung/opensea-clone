// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    // state variables that keep track of a number of tokens
    // automatically init with 0
    uint public tokenCount;
    // constructor function (called once after deployed to blockchain)
    constructor() ERC721("Alice NFT", "DAPP"){}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount++;
        // safely mint a new token
        _safeMint(msg.sender, tokenCount);
        // set token URI for a given token or sets metadata
        _setTokenURI(tokenCount, _tokenURI);
        // return id of token we minted by returning the tokenCount
        return(tokenCount);
    }
}

/***
    In hardhat console: npx hardhatconsole --network localhost
    const contract = await ethers.getContractAt("name", "address")
    await contract.name() will be "Alice NFT" 
    await contract.symbol() will be "DAPP"
 */