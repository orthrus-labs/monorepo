const { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    const curationFee = '10000000000000000' // 0.01 ETH / MATIC / AVAX
    const erc1155Address = '0xdc5C798efC37C0fFFf808bfFD546F9D6a73781ea'
    const linkToken = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'

    let args = [curationFee, erc1155Address, linkToken]
    log("---------------------")
    const Marketplace = await deploy('Marketplace', {
        from: deployer,
        args,
        log: true
    })
    log(`You have deployed the Marketplace contract to ${Marketplace.address}`)
    log(`Deployer address: ${deployer}`)
    const networkName = networkConfig[chainId]["name"]
    log(`Verify with: \n npx hardhat verify --network ${networkName} ${Marketplace.address} ${args.toString().replace(/,/g, " ")}`)
}

module.exports.tags = ['all', 'marketplace']