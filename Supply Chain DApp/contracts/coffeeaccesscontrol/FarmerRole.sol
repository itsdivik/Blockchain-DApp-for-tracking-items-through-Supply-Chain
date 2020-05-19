pragma solidity ^0.5.7;

// Import the library 'Roles'
import "./Roles.sol";

// This Defines a contract 'FarmerRole' to manage this role - add, remove, check
contract FarmerRole {
  using Roles for Roles.Role;

  // This Defines 2 events, one for Adding, and other for Removing
  event FarmerAdded(address indexed account);
  event FarmerRemoved(address indexed account);

  // This Defines a struct 'farmers' by inheriting from 'Roles' library, struct Role
  Roles.Role private farmers;

  // In the constructor make the address that deploys this contract the 1st farmer
  constructor() public {
    _addFarmer(msg.sender);
  }

  // This Defines a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyFarmer() {
    require(isFarmer(msg.sender), "You do not have the farmer role.");
    _;
  }

  // This Defines a function 'isFarmer' to check this role
  function isFarmer(address account) public view returns (bool) {
    return farmers.has(account);
  }

  // This Defines a function 'addFarmer' that adds this role
  function addFarmer(address account) public onlyFarmer {
    _addFarmer(account);
  }

  // This Defines a function 'renounceFarmer' to renounce this role
  function renounceFarmer() public {
    _removeFarmer(msg.sender);
  }

  // This Defines an internal function '_addFarmer' to add this role, called by 'addFarmer'
  function _addFarmer(address account) internal {
    farmers.add(account);
    emit FarmerAdded(account);
  }

  // This Defines an internal function '_removeFarmer' to remove this role, called by 'removeFarmer'
  function _removeFarmer(address account) internal {
    farmers.remove(account);
    emit FarmerRemoved(account);
  }
}