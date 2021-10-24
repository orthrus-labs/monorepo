const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace contract", () => {
  let owner
  let addr1
  let addr2
  let addrs
  let SampleERC721
  let sampleERC721
  let Marketplace
  let marketplace

  before(async function () {
    SampleERC721 = await ethers.getContractFactory('SampleERC721');
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners()
    sampleERC721 = await SampleERC721.deploy("CryptoLizards", "CLIZ")
    await sampleERC721.deployed()
    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy("10")
    await marketplace.deployed()
  });

  describe("Deployment", function () {
    it("Should return the sample NFT with the correct name and symbol", async () => {
      expect(await sampleERC721.name()).to.equal("CryptoLizards")
      expect(await sampleERC721.symbol()).to.equal("CLIZ")
    })
    it("Should return the marketplace with the correct curation fee", async () => {
      expect(await marketplace.getCurationFee()).to.equal("10")
    })
  })

  describe("Mint & List NFT", function () {
    it("Should mint a sample NFT to the owner", async () => {
      const res = await sampleERC721.mintToken(owner.address, 1, {from: owner.address})
      expect(await sampleERC721.ownerOf(1)).to.equal(owner.address)
      
    })
    it("Should made the owner set the NFT approved for the marketplace", async () => {
      const res3 = await sampleERC721.setApprovalForAll(marketplace.address, true, {from: owner.address})
      expect(await sampleERC721.isApprovedForAll(owner.address, marketplace.address)).to.equal(true)
    })
    it("Should list the NIFT on the marketplace and emit NFTListed event", async () => {
      const tx = await marketplace.listNFT(sampleERC721.address, 1, "test", 1000000)
      let receipt = await tx.wait();
      expect(receipt.events).to.not.equal([])
      const res = receipt.events?.filter((x) => {
        return x.event == "NFTListed"
      });
      expect(res[0].event).to.equal("NFTListed")
    })
  })


})
