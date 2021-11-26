const { networkConfig } = require('../helper-hardhat-config')

module.exports = async ({
    getNamedAccounts,
    deployments,
    getChainId
}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let args = [chainId];
    const ERC20 = await deploy('Dai', {
        from: deployer,
        args,
        log: true
    })
    log(`You have deployed the SampleERC20 contract to ${ERC20.address}`)
    log(`Deployer address: ${deployer}`)
    const networkName = networkConfig[chainId]["name"]
    log(`Verify with: \n npx hardhat verify --network ${networkName} ${ERC20.address} ${args.toString().replace(/,/g, " ")}`)
}

module.exports.tags = ['all', 'erc20']