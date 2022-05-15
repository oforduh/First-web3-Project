// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NDToken is ERC20 {
    constructor() ERC20("Nader Dabit Token", "NDT") {
        _mint(msg.sender, 100000 * (10 ** 18));
    }
}