const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace contract", () => {
  let owner
  let addr1
  let addr2
  let addr3
  let addrs
  let SampleERC721
  let sampleERC721
  let SampleERC20
  let sampleERC20
  let Marketplace
  let marketplace
  let SampleERC1155
  let sampleERC1155
  let SampleERC721URI
  let sampleERC721URI

  before(async () => {
    SampleERC721 = await ethers.getContractFactory('SampleERC721');
    SampleERC20 = await ethers.getContractFactory('Dai');
    SampleERC1155 = await ethers.getContractFactory('SampleERC1155');
    SampleERC721URI = await ethers.getContractFactory('NFT');
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
    sampleERC721 = await SampleERC721.deploy("CryptoLizards", "CLIZ")
    await sampleERC721.deployed()
    sampleERC721URI = await SampleERC721URI.deploy("Eskere", "ESK", "https://gateway.pinata.cloud/ipfs/QmY4LfLC7iBT4zhGG3sVog1NQ5FquhDUsmKfZNZbqvFtXu/")
    await sampleERC721URI.deployed()
    sampleERC20 = await SampleERC20.deploy(0);
    await sampleERC20.deployed()
    sampleERC1155 = await SampleERC1155.deploy("https://example");
    await sampleERC1155.deployed()
    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy("10",sampleERC1155.address)
    await marketplace.deployed()
    sampleERC1155.setMarketplaceAddress(marketplace.address, {from: owner.address})
  });

  describe("Deployment", () => {
    it("Should return the sample NFT with the correct name and symbol", async () => {
      expect(await sampleERC721.name()).to.equal("CryptoLizards")
      expect(await sampleERC721.symbol()).to.equal("CLIZ")
    })
    it("Should return the marketplace with the correct curation fee", async () => {
      expect(await marketplace.getCurationFee()).to.equal("10")
    })
    it("Should deploy the SampleERC1155 contract", async () => {
      expect(sampleERC1155.address).to.not.be.undefined;
    })
  })

  describe("Mint & List NFT", () => {
    it("Should mint a sample NFT to the owner", async () => {
      const res = await sampleERC721.mintToken(owner.address, 1, {from: owner.address})
      expect(await sampleERC721.ownerOf(1)).to.equal(owner.address)
    })
    it("Should made the owner set the NFT approved for the marketplace", async () => {
      const res3 = await sampleERC721.setApprovalForAll(marketplace.address, true, {from: owner.address})
      expect(await sampleERC721.isApprovedForAll(owner.address, marketplace.address)).to.equal(true)
    })
    it("Should list the NFT on the marketplace and emit NFTListed event", async () => {
      const tx = await marketplace.listNFT(sampleERC721.address, 1, "test", 1000000)
      let receipt = await tx.wait();
      expect(receipt.events).to.not.equal([])
      const res = receipt.events?.filter((x) => {
        return x.event == "NFTListed"
      });
      expect(res[0].event).to.equal("NFTListed")
    })
  })

  describe("Buy NFT", () => {
    it("Should transfer the NFT and emit NFTBought event", async () => {
      await sampleERC721.mintToken(owner.address, 2, {from: owner.address});
      const res = await sampleERC721.setApprovalForAll(marketplace.address, true, {from: owner.address})
      await marketplace.listNFT(sampleERC721.address, 2, "test", 1000000);
      const tx =await marketplace.connect(addr1).buyNFT(2,{from: addr1.address, value:1000000});
      let receipt = await tx.wait();
      expect(receipt.events).to.not.equal([])
      const res2 = receipt.events?.filter((x) => {
        return x.event == "NFTBought"
      });
      expect(res2[0].event).to.equal("NFTBought")
      expect(addr1.address).to.equal(receipt.events[2].args[4])
    })
    it("Should send the money to the seller and to the marketplace", async () => {
      await sampleERC721.mintToken(owner.address, 3, {from: owner.address});
      const res = await sampleERC721.setApprovalForAll(marketplace.address, true, {from: owner.address})
      const balanceOwner = await ethers.provider.getBalance(owner.address);
      const balanceMarketplace = await ethers.provider.getBalance(marketplace.address);
      await marketplace.listNFT(sampleERC721.address, 3, "test", 1000000000000000);
      const tx =await marketplace.connect(addr1).buyNFT(3,{from: addr1.address,value:1000000000000000});
      const balanceOwner2 = await ethers.provider.getBalance(owner.address);
      const balanceMarketplace2 = await ethers.provider.getBalance(marketplace.address);
      expect(balanceOwner2).to.be.above(balanceOwner)     
      expect(balanceMarketplace2).to.be.above(balanceMarketplace) 
    })
  })

    describe("Mint & Distribution of DAI", async () => {
     it("Should Mint ERC20 tokens successfully", async () => {
       await sampleERC20.mint(owner.address, 150, {from: owner.address})
       expect(await sampleERC20.balanceOf(owner.address)).to.equal(150)
       await sampleERC20.mint(addr1.address, 150, {from: owner.address})
       expect(await sampleERC20.balanceOf(addr1.address)).to.equal(150)
       await sampleERC20.mint(addr2.address, 150, {from: owner.address})
       expect(await sampleERC20.balanceOf(addr2.address)).to.equal(150)
       await sampleERC20.mint(addr3.address, 150, {from: owner.address})
       expect(await sampleERC20.balanceOf(addr3.address)).to.equal(150)
     })
     it("Should approve the marketplace to move owner's and other addresses DAI tokens", async () => {
       await sampleERC20.approve(marketplace.address, 999999999999, {from: owner.address})
       expect(await sampleERC20.allowance(owner.address, marketplace.address)).to.equal(999999999999)
       await sampleERC20.connect(addr1).approve(marketplace.address, 999999999999, {from: addr1.address})
       expect(await sampleERC20.allowance(addr1.address, marketplace.address)).to.equal(999999999999)
       await sampleERC20.connect(addr2).approve(marketplace.address, 999999999999, {from: addr2.address})
       expect(await sampleERC20.allowance(addr2.address, marketplace.address)).to.equal(999999999999)
       await sampleERC20.connect(addr3).approve(marketplace.address, 999999999999, {from: addr3.address})
       expect(await sampleERC20.allowance(addr3.address, marketplace.address)).to.equal(999999999999)
     })
   })

   describe("Bond ERC20 tokens", () => {
     it("Should let users bond different amount of ERC20s to an NFT ", async () => {
       await sampleERC721.mintToken(owner.address, 4, {from: owner.address});
       await marketplace.listNFT(sampleERC721.address, 4, "test", ethers.constants.WeiPerEther);
       await marketplace.bondNFT(4, 5, sampleERC20.address, {from: owner.address})
       expect(await sampleERC20.balanceOf(owner.address)).to.equal(145)
       await marketplace.connect(addr1).bondNFT(4, 10, sampleERC20.address, {from: addr1.address})
       expect(await sampleERC20.balanceOf(addr1.address)).to.equal(140)
       await marketplace.connect(addr2).bondNFT(4, 15, sampleERC20.address, {from: addr2.address})
       expect(await sampleERC20.balanceOf(addr2.address)).to.equal(135)
       // THIS SHOULD FAIL! OR MAYBE NOT? What if the owner bonds to itself?
       expect(await sampleERC20.balanceOf(marketplace.address)).to.equal(30)
     })
     it("Should let the user mint the selected amount of ERC1155 tokens", async () => {
       expect(await sampleERC1155.balanceOf(owner.address, 4)).to.equal(223)
       expect(await sampleERC1155.balanceOf(addr1.address, 4)).to.equal(289)
       expect(await sampleERC1155.balanceOf(addr2.address, 4)).to.equal(337)
     })
   })

   describe("Unbond ERC20 tokens", () => {
     it("Should let users unbond the amount of ERC20 tokens they have previously bonded", async () => {
       await sampleERC1155.setApprovalForAll(marketplace.address, true)
       await marketplace.unbondNFT(4, {from: owner.address});
       expect(await sampleERC20.balanceOf(owner.address)).to.equal(150)
     })
     it("Should burn the ERC1155 tokens", async () => {
       expect(await sampleERC1155.balanceOf(owner.address, 3)).to.equal(0)
     })
   })

  describe("Ownable", () => {
    it("Set the owner", async () => {
      expect(await marketplace.owner()).to.equal(owner.address)
    })
  })

  describe("ERC721", () => {
    it("Should set the correct URI", async () => {
      expect(await sampleERC721URI.tokenURI(1)).to.equal("https://gateway.pinata.cloud/ipfs/QmY4LfLC7iBT4zhGG3sVog1NQ5FquhDUsmKfZNZbqvFtXu/1.json")
    })
  })

  describe("Voting Power", () => {
    it("Should set the correct voting power", async () => {
      await sampleERC721.mintToken(owner.address, 5, {from: owner.address});
      await marketplace.listNFT(sampleERC721.address, 5, "test", ethers.constants.WeiPerEther);
      await marketplace.connect(addr1).bondNFT(5, 100, sampleERC20.address, {from: addr1.address});
      await marketplace.connect(addr2).bondNFT(5, 100, sampleERC20.address, {from: addr2.address});
      await marketplace.connect(addr3).bondNFT(5, 100, sampleERC20.address, {from: addr3.address});
      await marketplace.connect(owner).buyNFT(5, {from: owner.address, value: ethers.constants.WeiPerEther});
      expect(await sampleERC1155.balanceOf(addr1.address, 5)).to.equal(1000);
      expect(await sampleERC1155.balanceOf(addr2.address, 5)).to.equal(916);
      expect(await sampleERC1155.balanceOf(addr3.address, 5)).to.equal(871);
    })
    it("Should let a user claim the reward", async () => {
      await sampleERC1155.connect(addr1).setApprovalForAll(marketplace.address, true, {from: addr1.address});
      const balanceAddr1 = await ethers.provider.getBalance(addr1.address);
      await marketplace.connect(addr1).claimReward(5, {from:addr1.address});
      const balanceAddr2 = await ethers.provider.getBalance(addr1.address);
      expect(await sampleERC1155.balanceOf(addr1.address, 5)).to.equal(0);
      expect(await sampleERC20.balanceOf(addr1.address)).to.equal(140);
      expect(balanceAddr2).to.be.above(balanceAddr1)
    })
  })

})
