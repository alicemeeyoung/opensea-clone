// All tests for NFT.sol & Marketplace.sol
import { expect } from 'chai';
import { ethers } from 'hardhat';
import type { Contract } from 'ethers';
import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

// conversion eth <=> wei
const toWei = (num: number) => ethers.utils.parseEther(num.toString());
const fromWei = (num: number) => ethers.utils.formatEther(num);

describe('NFTMarketplace', () => {
  let deployer: SignerWithAddress,
    address1: SignerWithAddress,
    address2: SignerWithAddress,
    nft: Contract,
    marketplace: Contract;
  let feePercent = 1;
  let URI = 'Test URI';

  beforeEach(async () => {
    const NFT = await ethers.getContractFactory('NFT');
    const Marketplace = await ethers.getContractFactory('Marketplace');
    // get signers
    [deployer, address1, address2] = await ethers.getSigners();
    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe('Deployment', () => {
    it('Should track name & symbol of the nft collection', async () => {
      expect(await nft.name()).to.equal('Alice NFT');
      expect(await nft.symbol()).to.equal('DAPP');
    });

    it('Should track feeAccount & feePercent of the marketplace collection', async () => {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });

  describe('Minting NFTS', () => {
    it('Should track each minted NFT', async () => {
      // address1 mints an nft
      await nft.connect(address1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(address1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);

      // address2 mints an nft
      await nft.connect(address2).mint(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(address2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe('Making marketplace items', () => {
    beforeEach(async () => {
      // address1 mints nft
      await nft.connect(address1).mint(URI);
      // address1 approves marketplace to spend nft;
      await nft.connect(address1).setApprovalForAll(marketplace.address, true);
    });

    it('Should track newly created items, transfer NFT from seller to marketplace & emit Offered', async () => {
      // marketplace connects to address1 and creates an item
      // emits the offered event
      await expect(
        marketplace.connect(address1).makeItem(nft.address, 1, toWei(1))
      )
        .to.emit(marketplace, 'Offered')
        .withArgs(1, nft.address, 1, toWei(1), address1.address);

      // Owner of NFT should be marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      // // check itemcount is equal to 1
      expect(await marketplace.itemCount()).to.equal(1);
      // // fetch newly created item from items mapping & pass in the key of 1 (itemId 1)
      const item = await marketplace.items(1);

      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(toWei(1));
      expect(item.sold).to.equal(false);
    });

    it('Should fail if price is set to 0', async () => {
      await expect(
        marketplace.connect(address1).makeItem(nft.address, 1, toWei(0))
      ).to.be.revertedWith('Price must be greater than zero');
    });
  });
});
