pragma solidity ^0.4.17;

contract Base {

  struct LendingRequest {
    address asker;
    uint amount;
    address lender;
    bool settled;
    string purpose;
    bool lent;
    uint creationTime;
    bool exists;
  }

  mapping(address => LendingRequest) public lendingRequests;

  function Base() public payable {
  }

  function ask(uint amount, string purpose) public {
    require(amount > 0);
    require(!lendingRequests[msg.sender].exists);

    LendingRequest memory request = LendingRequest({
        asker: msg.sender,
        amount: amount,
        lender: 0,
        settled: false,
        purpose: purpose,
        lent: false,
        creationTime: now,
        exists: true
    });

    lendingRequests[msg.sender] = request;
  }

  function lend(address asker) public payable {
    require(!lendingRequests[asker].lent);
    require(lendingRequests[asker].amount == msg.value);

    asker.transfer(msg.value);
    lendingRequests[asker].lent = true;
  }
}
