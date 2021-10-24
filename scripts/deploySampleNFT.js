const hre = require("hardhat");

async function main() {
  const SampleERC721 = await hre.ethers.getContractFactory("SampleERC721");
  const sampleERC721 = await SampleERC721.deploy("CryptoLizards", "CLIZ");
  await sampleERC721.deployed();
  console.log("Sample NFT contract deployed to:", sampleERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
