pragma solidity ^0.5.7;
contract Ownable {
    address private origOwner;
    event TransferOwnership(address indexed oldOwner, address indexed newOwner);

    constructor () public {
        origOwner = msg.sender;
        emit TransferOwnership(address(0), origOwner);
    }
    function _owner() public view returns (address) {
        return origOwner;
    }
    modifier onlyOwner() {
        require(isOwner(), "Only the contract owner can call this function.");
        _;
    }
    function isOwner() public view returns (bool) {
        return msg.sender == origOwner;
    }
    function renounceOwnership() public onlyOwner {
        emit TransferOwnership(origOwner, address(0));
        origOwner = address(0);
    }
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0), "The address provided is not valid.");
        emit TransferOwnership(origOwner, newOwner);
        origOwner = newOwner;
    }
}
