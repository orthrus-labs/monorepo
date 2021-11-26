const { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    const networkName = networkConfig[chainId]["name"]

    const curationFee = '10000000000000000' // 0.01 ETH / MATIC / AVAX
    const linkTokenAddress = networkConfig[chainId]['linkToken']
    const oracle = networkConfig[chainId]['oracle']
    const name = 'testNFT'
    const symbol = 'test'
    const URI = 'https://gateway.pinata.cloud/ipfs/QmY4LfLC7iBT4zhGG3sVog1NQ5FquhDUsmKfZNZbqvFtXu/'
    const metadataURI ='https://gateway.pinata.cloud/ipfs/QmY4LfLC7iBT4zhGG3sVog1NQ5FquhDUsmKfZNZbqvFtXu/1.json'
    const baseURI = 'https://example'
    const ERC20Address = '0xE60e6676eCB09bC095D36AB83B46C4695F79372d'

    //deploying SampleERC1155 contract
    log("---------------------")
    const ERC1155 = await deploy('SampleERC1155', {
        from: deployer,
        args: [baseURI],
        log: true
    })
    log(`You have deployed the SampleERC1155 contract to ${ERC1155.address}`)
    log(`Deployer address: ${deployer}`)
    log(`Verify with: \n npx hardhat verify --network ${networkName} ${ERC1155.address} ${baseURI.toString().replace(/,/g, " ")}`)

    //deploying SampleERC721URI contract
    let args_ERC721 = [name, symbol, URI]
    log("---------------------")
    const ERC721URI = await deploy('NFT', {
        from: deployer,
        args :args_ERC721,
        log: true
    })
    log(`You have deployed the SampleERC721URI contract to ${ERC721URI.address}`)
    log(`Deployer address: ${deployer}`)
    log(`Verify with: \n npx hardhat verify --network ${networkName} ${ERC721URI.address} ${args_ERC721.toString().replace(/,/g, " ")}`)

    //deploying Marketplace contract
    let args = [curationFee, ERC1155.address, linkTokenAddress, oracle]
    log("---------------------")
    const Marketplace = await deploy('Marketplace', {
        from: deployer,
        args,
        log: true
    })
    log(`You have deployed the Marketplace contract to ${Marketplace.address}`)
    log(`Deployer address: ${deployer}`)
    log(`Verify with: \n npx hardhat verify --network ${networkName} ${Marketplace.address} ${args.toString().replace(/,/g, " ")}`)

    const accounts = await hre.ethers.getSigners()
    const signer = accounts[0]
    const ERC721URIContract = await ethers.getContractFactory("NFT")
    const erc721URI = new ethers.Contract(ERC721URI.address, ERC721URIContract.interface, signer)
    const MarketplaceContract = await ethers.getContractFactory("Marketplace")
    const marketplace = new ethers.Contract(Marketplace.address, MarketplaceContract.interface, signer)
    const ERC1155Contract = await ethers.getContractFactory("SampleERC1155")
    const erc1155 = new ethers.Contract(ERC1155.address, ERC1155Contract.interface, signer)
    const ERC20Contract = await ethers.getContractFactory("Dai")
    const erc20 = new ethers.Contract(ERC20Address, ERC20Contract.interface, signer)


    // Fund with 1 LINK
    log('---Funding with LINK---')
    const linkTokenContract = await ethers.getContractFactory("LinkToken")
    const linkToken = new ethers.Contract(linkTokenAddress, linkTokenContract.interface, signer)
    let fund_tx = await linkToken.transfer(Marketplace.address, ethers.constants.WeiPerEther)
    await fund_tx.wait(1)

    log('---Setting approval---')
    await erc721URI.setApprovalForAll(Marketplace.address, true, {from: deployer})
    log('---Listing the NFT---')
    await marketplace.listNFT(ERC721URI.address, 1, metadataURI, ethers.constants.WeiPerEther)
    log('---Setting Marketplace address in the Sample ERC1155 contract---')
    await erc1155.setMarketplaceAddress(Marketplace.address, {from: deployer})
    log('---Minting ERC20---')
    await erc20.mint(deployer, (50 * ethers.constants.WeiPerEther), {from: deployer})
    log('---Approve---')
    await erc20.approve(marketplace.address, 999999999999, {from: deployer})
    log('---Bonding---')
    await marketplace.bondNFT(1, 10, ERC20Address, 1, {from: deployer})

}

module.exports.tags = ['all', 'marketplace']