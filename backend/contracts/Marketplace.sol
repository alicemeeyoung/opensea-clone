// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// protect marketplace from reentrancy attacks
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {

    // variables
    address payable public immutable feeAccount; //account that receives fees
    uint public immutable feePercent; // fee percentage on sales
    uint public itemCount;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price; // price set at
        address payable seller;
        bool sold; // has it ben sold?
    }

    // define event
    event Offered (
        uint itemId,
        address indexed nft, 
        uint tokenId,
        uint price,
        address indexed seller
    );

    // itemId => Item
    mapping(uint => Item) public items;

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        // fn stops executing if false & changes to state will be reverted
        require(_price > 0, 'Price must be greater than zero'); 
        // increase the itemCount
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        // emit offered event
        emit Offered (
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }
}
