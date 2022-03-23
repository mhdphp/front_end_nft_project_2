// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SafeMath {
    // build functions to perform safe math operations that would
    // otherwise replace intuitive preventive measures

    function add(uint256 x, uint256 y) internal pure returns(uint256){
        uint256 r = x + y;
        // add only the positive numbers
        require(r >= x, 'SafeMath: addition overflow');
        return r;
    }

    function sub(uint256 x, uint256 y) internal pure returns(uint256){
        // result can be only positive
        require(y <= x, 'SafeMath: subtraction overflow');
        uint256 r = x - y;
        return r;
    }

    function mul(uint256 x, uint256 y) internal pure returns(uint256){
        uint256 r = x * y;
        // result can be only positive
        require(r / y == x, 'SafeMath: multiplication overflow');
        return r;
    }

    function divide(uint256 x, uint256 y) internal pure returns(uint256){
        require(y > 0, 'SafeMath: division by 0');
        uint256 r = x / y;
        // result can be only positive
        return r;
    }

    // gas spending remaining untouched
    function mod(uint256 x, uint256 y) internal pure returns(uint256){
        require(y != 0, 'SafeMath: modulo by 0');
        uint256 r = x % y;
        // result can be only positive
        return r;
    }
}