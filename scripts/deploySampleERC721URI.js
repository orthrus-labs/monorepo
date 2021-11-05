const hre = require("hardhat");

async function main() {
  const SampleERC721 = await hre.ethers.getContractFactory("NFT");
  const sampleERC721 = await SampleERC721.deploy("Arteezy", "RTZ", "https://gateway.pinata.cloud/ipfs/QmY4LfLC7iBT4zhGG3sVog1NQ5FquhDUsmKfZNZbqvFtXu/");
  await sampleERC721.deployed();
  console.log("SampleERC721URI contract deployed to:", sampleERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
