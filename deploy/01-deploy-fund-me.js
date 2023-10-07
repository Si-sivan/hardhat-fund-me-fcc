const {networkConfig, developmentChains} = require("../helper-hardhat-config")
const {network} = require("hardhat")
const {verify} = require("../utils/verify")
require("dotenv").config()
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments 
    const { deployer } = await getNamedAccounts() 
    const chainId = network.config.chainId 

    let ethUsdPriceFeedAddress 
    if(chainId == 31337){
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {   
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    log("---------------------------------------------")
    log("Deploying fundMe and waiting for confirmations...")

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], 
        log: true, 
        waitConfirmations: network.config.blockConfirmations || 1,
    })  
    // 不想在本地网络上进行验证
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, [ethUsdPriceFeedAddress])

    }
    
    log("--------------------------------------------")

}
module.exports.tags = ["all", "fundme"]