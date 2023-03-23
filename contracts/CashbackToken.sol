pragma solidity ^0.8.0; //SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CashbackToken is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 100 * 10**18;
    uint256 public constant CB_TO_ETH = 100; // 1 CB$ = 0.01 ETH

    mapping(address => bool) public registeredUsers;

    event UserRegistered(address indexed user);

    constructor() ERC20("Cashback Token", "CB$") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function register() public {
        require(!registeredUsers[msg.sender], "User already registered");

        registeredUsers[msg.sender] = true;
        _mint(msg.sender, 100 * 10**18); // Credita 100 CB$ ao usuário

        emit UserRegistered(msg.sender);
    }

    function redeem(uint256 amount) public {
        uint256 ethAmount = (amount * CB_TO_ETH) / 10**18;
        require(balanceOf(msg.sender) >= amount, "Insufficient CB$ balance");
        require(address(this).balance >= ethAmount, "Insufficient ETH balance");

        _burn(msg.sender, amount);

        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "Transfer failed");
    }

    function transferCbToEth(uint256 cbAmount) public pure returns (uint256) {
        return (cbAmount * CB_TO_ETH) / 10**18;
    }

    function tokenInfo() public view returns (string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) {
        return (this.name(), this.symbol(), this.decimals(), this.totalSupply());
    }

    receive() external payable {}
}
