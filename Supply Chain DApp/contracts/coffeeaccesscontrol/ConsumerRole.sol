pragma solidity ^0.5.7;

// Import the library 'Roles'
import "./Roles.sol";

// This Defines a contract 'ConsumerRole' to manage this role - add, remove, check
contract ConsumerRole {
  using Roles for Roles.Role;

  // This Defines 2 events, one for Adding, and other for Removing
  event ConsumerAdded(address indexed account);
  event ConsumerRemoved(address indexed account);

  // This Defines a struct 'consumers' by inheriting from 'Roles' library, struct Role
  Roles.Role private consumers;

  // In the constructor make the address that deploys this contract the 1st consumer
  constructor() public {
    _addConsumer(msg.sender);
  }

  // This Defines a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyConsumer() {
    require(isConsumer(msg.sender), "You do not have the consumer role.");
    _;
  }

  // This Defines a function 'isConsumer' to check this role
  function isConsumer(address account) public view returns (bool) {
    return consumers.has(account);
  }

  // This Defines a function 'addConsumer' that adds this role
  function addConsumer(address account) public onlyConsumer {
    _addConsumer(account);
  }

  // This Defines a function 'renounceConsumer' to renounce this role
  function renounceConsumer() public {
    _removeConsumer(msg.sender);
  }

  // This Defines an internal function '_addConsumer' to add this role, called by 'addConsumer'
  function _addConsumer(address account) internal {
    consumers.add(account);
    emit ConsumerAdded(account);
  }

  // This Defines an internal function '_removeConsumer' to remove this role, called by 'removeConsumer'
  function _removeConsumer(address account) internal {
    consumers.remove(account);
    emit ConsumerRemoved(account);
  }
}