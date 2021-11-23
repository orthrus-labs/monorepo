const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace contract", async () => {
  before(async () => {
    //get Signers
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners()
    //deploying contracts
    LinkToken = await ethers.getContractFactory('LinkToken');
    MockOracle = await ethers.getContractFactory('MockOracle');
    SampleERC721 = await ethers.getContractFactory('SampleERC721');
    SampleERC20 = await ethers.getContractFactory('Dai');
    SampleERC1155 = await ethers.getContractFactory('SampleERC1155');
    SampleERC721URI = await ethers.getContractFactory('NFT');
    linkToken = await LinkToken.deploy();
    await linkToken.deployed();
    mockOracle = await MockOracle.deploy(linkToken.address);
    await mockOracle.deployed();
    sampleERC721 = await SampleERC721.deploy("CryptoLizards", "CLIZ")
    await sampleERC721.deployed()
    sampleERC721URI = await SampleERC721URI.deploy("Eskere", "ESK", "https://gateway.pinata.cloud/ipfs/QmY4LfLC7iBT4zhGG3sVog1NQ5FquhDUsmKfZNZbqvFtXu/")
    await sampleERC721URI.deployed()
    sampleERC20 = await SampleERC20.deploy(0);
    await sampleERC20.deployed()
    sampleERC1155 = await SampleERC1155.deploy("https://example");
    await sampleERC1155.deployed()
    Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy("10", sampleERC1155.address, linkToken.address, mockOracle.address)
    await marketplace.deployed()
    sampleERC1155.setMarketplaceAddress(marketplace.address, {from: owner.address})
    let fund_tx = await linkToken.transfer(marketplace.address, 100)
    await fund_tx.wait(1)
    await linkToken.approve(marketplace.address, 100, {from: owner.address});
    //sending link to the marketplace contract
    let transferTransaction = await linkToken.transfer(marketplace.address,'1000000000000000000');
    await transferTransaction.wait()
    console.log('hash: ' + transferTransaction.hash);
    console.log(await linkToken.balanceOf(marketplace.address));
  });

  describe("Deployment", () => {
    it("Should return the sample NFT with the correct name and symbol", async () => {
      expect(await sampleERC721.name()).to.equal("CryptoLizards")
      expect(await sampleERC721.symbol()).to.equal("CLIZ")
    })
    it("Should return the marketplace with the correct curation fee", async () => {
      expect(await marketplace.getCurationFee()).to.equal("10")
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
      await marketplace.listNFT(sampleERC721.address, 2, "test", 1000000, {from: owner.address});
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
      expect(await marketplace.getNFTOwner(3)).to.be.equal(owner.address)
      const tx =await marketplace.connect(addr1).buyNFT(3,{from: addr1.address,value:1000000000000000});
      const balanceOwner2 = await ethers.provider.getBalance(owner.address);
      const balanceMarketplace2 = await ethers.provider.getBalance(marketplace.address);
      expect(await marketplace.getNFTOwner(3)).to.be.equal(addr1.address)
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

   describe("NthRoot", async () => {
    it("Should return the correct number ", async () => {
      let sqrt = await marketplace.nthRoot(100, 2, 4, 10)
      expect(sqrt).to.equal(100000)
      sqrt = await marketplace.nthRoot(321, 2, 4, 10)
      expect(sqrt).to.equal(179165)
      sqrt = await marketplace.nthRoot(10000, 2, 4, 10)
      expect(sqrt).to.equal(1000000)
      sqrt = await marketplace.nthRoot(50000, 2, 4, 10)
      expect(sqrt).to.equal(2236539)
      sqrt = await marketplace.nthRoot(300, 2, 4, 10)
      expect(sqrt).to.equal(173205)
    })
   })

   describe("Bond ERC20 tokens", () => {
     it("Should let users bond different amount of ERC20s to an NFT ", async () => {
       await sampleERC721.mintToken(owner.address, 4, {from: owner.address});
       await marketplace.listNFT(sampleERC721.address, 4, "test", ethers.constants.WeiPerEther);
       //owner bond 150 tokens after 60 seconds
       let transaction = await marketplace.bondNFT(4, 150, sampleERC20.address, 4, {from: owner.address})
       let tx_receipt = await transaction.wait()
       await mockOracle.fulfillOracleRequest(tx_receipt.events[5].args[7],"0x0000000000000000000000000000000000000000000000001726ebb1120b8730");
       expect(await sampleERC20.balanceOf(owner.address)).to.equal(0)
       //addr1 bond 10 tokens after 100 seconds
       transaction = await marketplace.connect(addr1).bondNFT(4, 10, sampleERC20.address, 4, {from: addr1.address})
       tx_receipt = await transaction.wait()
       await mockOracle.fulfillOracleRequest(tx_receipt.events[5].args[7],"0x00000000000000000000000000000000000000000000000018adb7b3a2c2de30");
       expect(await sampleERC20.balanceOf(addr1.address)).to.equal(140)
       //addr2 bond 15 tokens after 100 seconds
       transaction = await marketplace.connect(addr2).bondNFT(4, 15, sampleERC20.address, 4, {from: addr2.address})
       tx_receipt = await transaction.wait()
       await mockOracle.fulfillOracleRequest(tx_receipt.events[5].args[7],"0x00000000000000000000000000000000000000000000000018adb7b3a2c2de30");
       expect(await sampleERC20.balanceOf(addr2.address)).to.equal(135)
       expect(await sampleERC20.balanceOf(marketplace.address)).to.equal(175)
     })
     it("Should let the user mint the selected amount of ERC1155 tokens", async () => {
       expect(await sampleERC1155.balanceOf(owner.address, 4)).to.equal(734)
       expect(await sampleERC1155.balanceOf(addr1.address, 4)).to.equal(177)
       expect(await sampleERC1155.balanceOf(addr2.address, 4)).to.equal(217)
     })
   })

  //  describe("Unbond ERC20 tokens", () => {
  //    it("Should let users unbond the amount of ERC20 tokens they have previously bonded", async () => {
  //      await sampleERC1155.setApprovalForAll(marketplace.address, true)
  //      await marketplace.unbondNFT(4, {from: owner.address});
  //      expect(await sampleERC20.balanceOf(owner.address)).to.equal(150)
  //    })
  //    it("Should burn the ERC1155 tokens", async () => {
  //      expect(await sampleERC1155.balanceOf(owner.address, 4)).to.equal(0)
  //    })
  //  })

  describe("Ownable", () => {
    it("Set the owner", async () => {
      expect(await marketplace.owner()).to.equal(owner.address)
    })
  })

  describe("ERC721URI", () => {
    it("Should set the correct URI", async () => {
      expect(await sampleERC721URI.tokenURI(1)).to.equal("https://gateway.pinata.cloud/ipfs/QmY4LfLC7iBT4zhGG3sVog1NQ5FquhDUsmKfZNZbqvFtXu/1.json")
    })
  })

  describe("Claim Reward", () => {
    it("Should let a user claim the reward", async () => {
      await marketplace.connect(addr1).buyNFT(4,{from: addr1.address, value:ethers.constants.WeiPerEther});
      await sampleERC1155.connect(addr1).setApprovalForAll(marketplace.address, true, {from: addr1.address});
      const balanceAddr1 = await ethers.provider.getBalance(addr1.address);
      await marketplace.connect(addr1).claimReward(4, {from:addr1.address});
      const balanceAddr2 = await ethers.provider.getBalance(addr1.address);
      expect(await sampleERC1155.balanceOf(addr1.address, 4)).to.equal(0);
      expect(await sampleERC20.balanceOf(addr1.address)).to.equal(150);
      expect(balanceAddr2).to.be.above(balanceAddr1)
    })
  })
  describe("GetUnsoldNFTsOnMarket", async () => {
    it("Should return the listed NFTs", async () => {
      await sampleERC721.mintToken(owner.address, 5, {from: owner.address});
      await marketplace.listNFT(sampleERC721.address, 5, "test", 100);
      await marketplace.connect(addr1).buyNFT(5,{from: addr1.address, value: 100});
      const test = await marketplace.getUnsoldNFTsOnMarket();
      expect(test.length).to.equal(1);
    })
  })
  describe("GetNFTBond", async () => {
    it("Should return the bonders array", async () => {
      const bonders = await marketplace.getNFTBond(4);
      expect(bonders.length).to.equal(3);
    })
  })
  describe("FetchMyNFTs", async () => {
    it("Should return the NFTs bought by the sender", async () => {
      const fetch = await marketplace.connect(addr1).fetchMyNFTs({from: addr1.address});
      expect(fetch.length).to.equal(4);
    })
  })
  describe("GetMarketItem", () => {
    it("Should return the market item corresponding to the given Id", async () => {
      const marketItem = await marketplace.getMarketItem(1);
      expect(marketItem.tokenId).to.equal(1)
    })
  })
})
