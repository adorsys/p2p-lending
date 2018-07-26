pragma solidity ^0.4.17;

contract Base {
  string public message;

  function Base(string initialMessage) public {
    message = initialMessage;
  }

  function setMessage(string newMessage) public {
    message = newMessage;
  }
}
