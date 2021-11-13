const fs = require('fs')
const { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    log("--------")
    const SVGNFT = await deploy("SVGNFT", {
        from: deployer,
        log: true
    })
    log(`you have deployed an NFT contract to ${SVGNFT.address}`)
    log(`deployer address: ${deployer}`)
    const filepath = "./images/polygon.svg"
    const svg = fs.readFileSync(filepath, { encoding: "utf-8" })

    const svgNFTContract = await ethers.getContractFactory("SVGNFT")
    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const svgNFT = new ethers.Contract(SVGNFT.address, svgNFTContract.interface, signer)
    const networkName = networkConfig[chainId]['name']
    log(`Verify with: \n npx hardhat verify --network ${networkName} ${SVGNFT.address}`)

    let transactionResponse = await svgNFT.create(svg)
    let receipt = await transactionResponse.wait(1)
    log(`You made an NFT`)
    log(`You can view the token URI here: ${await svgNFT.tokenURI(0)}`)
}
