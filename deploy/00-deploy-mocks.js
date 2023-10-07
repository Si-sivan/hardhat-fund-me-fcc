const { network } = require("hardhat")
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // 我们不打算将这个"mock"合约部署到测试网或是已经有喂价数据的网络上
    // 如果该chainId在本地部署链上，则部署mocks
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")  // 这是从deployments中获取的，基本就等于console.log
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],     // 为MockV3Aggregator的构造函数传递参数；在github或者node_modules/@chainlink/src/v0.6/tests
            // decimals :decimals函数
            // initialAnswer：喂价多少的意思，我们可以指定喂价的价格（将其添加在helper-hardhat-config.js中

        })
        log("Mocks deployed!")
        log("----------------------------------------------")
    }
}


module.exports.tags = ["all", "mocks"]
