pragma solidity ^0.8.0; //SPDX-License-Identifier: MIT

contract Cashback {
    mapping(address => uint256) public cashbackBalances;

    event CashbackReceived(address indexed user, uint256 amount);
    event CashbackWithdrawn(address indexed user, uint256 amount);

    function registerCashback(uint256 amount) external {
        cashbackBalances[msg.sender] += amount;
        emit CashbackReceived(msg.sender, amount);
    }

function withdrawCashback() public {
    uint256 amount = cashbackBalances[msg.sender];
    require(amount > 0, "No cashback balance available");

    cashbackBalances[msg.sender] = 0;

    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");

    emit CashbackWithdrawn(msg.sender, amount);
}

    function hasCashbackBalance(address user) public view returns (bool) {
    return cashbackBalances[user] > 0;
}

    receive() external payable {}
}
