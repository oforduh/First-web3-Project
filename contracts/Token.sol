//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.3;

import "hardhat/console.sol";

contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a); 
        c = a - b; 
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
         c = a * b; require(a == 0 || c / a == b); 
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) { 
        require(b > 0);
        c = a / b;
    }
}

contract Token is SafeMath{
  
    string public name = "OFORDU HH Token";
    string public symbol = "OHH";
    uint256 public totalSupply=10000000000000000000000000;
    uint8 public  decimals = 18; 
    mapping(address=>uint) balances;
    mapping(address => mapping(address => uint)) allowed;


    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    constructor ()  {
        balances[msg.sender]=totalSupply;
    }
        function inspectSender() public view returns (address){
        return msg.sender;
    }
        function inspectOrigin() public view returns (address){
        return tx.origin;
    }


    function transfer(address to, uint amount)  public returns (bool) {
        require(balances[msg.sender]>= amount, "Not enough Tokens");
        require(to != address(0));
        balances[msg.sender] = safeSub(balances[msg.sender], amount);
        balances[to] = safeAdd(balances[to], amount);
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function balanceOf(address owner) public view returns (uint256 balance){
        return  balances[owner];
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

      function approve(address spender, uint amount) public returns (bool success) {
        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

     function transferFrom(address from, address to, uint amount) public returns (bool success) {
        balances[from] = safeSub(balances[from], amount);
        allowed[from][msg.sender] = safeSub(allowed[from][msg.sender], amount);
        balances[to] = safeAdd(balances[to], amount);
        emit Transfer(from, to, amount);
        return true;
    }



}