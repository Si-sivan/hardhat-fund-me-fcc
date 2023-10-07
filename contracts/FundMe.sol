// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;
import "./PriceConverter.sol";
error FundMe__NotOwner();

contract FundMe {
    using PriceConverter for uint256;
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    mapping(address => uint256) private s_addressToAmountFunded;
    address[] private s_funders;

    address private immutable i_owner;
    AggregatorV3Interface public s_priceFeed; // *******************

    constructor(address priceFeedAddress) {
        // *******************
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress); // ***
    }

    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, //*** */
            "Didn't send enough"
        );
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex = funderIndex + 1
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }(""); 
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner{
        // 将整个s_funders数组一次性读入memory内存中，然后从memory内存中读取而不是从storage存储中读取
        address[] memory funders = s_funders;
        // mapping映射不能存储在memory中
        for(uint256 funderIndex = 0; funderIndex < funders.length; funderIndex++){
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    function getOwner() public view returns(address){
        return i_owner;
    }
    function getFunder(uint256 index) public view returns(address){
        return s_funders[index];
    } 
    function getAddressToAmountFunded(address funder) public view returns(uint256){
        return s_addressToAmountFunded[funder];
    }
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }


    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }
}
