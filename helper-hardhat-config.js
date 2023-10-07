const networkConfig = {
    31337: {
        name: "localhost",
    },
    11155111: { // Sepolia测试网的chainId //https://sepolia.infura.io/v3/8d56c197af634a44bf2fb0ed21c04303
             name: "sepolia",
             ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },

}        
// 如何在本地网络做测试
const developmentChains = ["hardhat", "localhost"]  
const DECIMALS = "8"   // decimals是小数位数的意思，为什么等于8，自己定义的吗？？？
const INITIAL_ANSWER = "200000000000"  // why???
// 现在我们就有一个简单的方法，来跟踪不同喂价数据在不同链上的不同合约地址
// 需要导出networkConfig,以便其它脚本能够使用它
module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
}