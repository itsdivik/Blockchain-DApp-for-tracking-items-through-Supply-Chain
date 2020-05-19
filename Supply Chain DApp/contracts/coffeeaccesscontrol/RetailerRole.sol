pragma solidity ^0.5.7;

// Import the library 'Roles'
import "./Roles.sol";

// This Defines a contract 'RetailerRole' to manage this role - add, remove, check
contract RetailerRole {
  using Roles for Roles.Role;

  // This Defines 2 events, one for Adding, and other for Removing
  event RetailerAdded(address indexed account);
  event RetailerRemoved(address indexed account);

  // This Defines a struct 'retailers' by inheriting from 'Roles' library, struct Role
  Roles.Role private retailers;

  // In the constructor make the address that deploys this contract the 1st retailer
  constructor() public {
    _addRetailer(msg.sender);
  }

  // This Defines a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyRetailer() {
    require(isRetailer(msg.sender), "You do not have the farmer role.");
    _;
  }

  // This Defines a function 'isRetailer' to check this role
  function isRetailer(address account) public view returns (bool) {
    return retailers.has(account);
  }

  // This Defines a function 'addRetailer' that adds this role
  function addRetailer(address account) public onlyRetailer {
    _addRetailer(account);
  }

  // This Defines a function 'renounceRetailer' to renounce this role
  function renounceRetailer() public {
    _removeRetailer(msg.sender);
  }

  // This Defines an internal function '_addRetailer' to add this role, called by 'addRetailer'
  function _addRetailer(address account) internal {
    retailers.add(account);
    emit RetailerAdded(account);
  }

  // This Defines an internal function '_removeRetailer' to remove this role, called by 'removeRetailer'
  function _removeRetailer(address account) internal {
    retailers.remove(account);
    emit RetailerRemoved(account);
  }
}