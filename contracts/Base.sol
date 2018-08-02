pragma solidity ^0.4.17;

contract Base {

    struct LendingRequest {
        address asker;
        uint amount;
        uint paybackAmount;
        address lender;
        bool settled;
        string purpose;
        bool lent;
        uint creationTime;
    }

    mapping(address => LendingRequest) public lendingRequests;

    function Base() public payable {
    }

    function ask(uint amount, uint paybackAmount, string purpose) public {
        require(amount > 0);
        require(paybackAmount > amount);
        require(lendingRequests[msg.sender].amount == 0);

        LendingRequest memory request = LendingRequest({
            asker: msg.sender,
            amount: amount,
            paybackAmount: paybackAmount,
            lender: 0,
            settled: false,
            purpose: purpose,
            lent: false,
            creationTime: now
            });

        lendingRequests[msg.sender] = request;
    }

    function lend(address asker) public payable {
        require(lendingRequests[asker].asker != msg.sender);
        require(!lendingRequests[asker].lent);
        require(lendingRequests[asker].amount == msg.value);

        /// Bad practice to directly send as side effect (see Withdrawal Pattern)
        asker.transfer(msg.value);
        lendingRequests[asker].lent = true;
    }

    function settle() public payable {
        require(lendingRequests[msg.sender].lent);
        require(!lendingRequests[msg.sender].settled);
        require(lendingRequests[msg.sender].paybackAmount == msg.value);

        /// Bad practice to directly send as side effect (see Withdrawal Pattern)
        lendingRequests[msg.sender].lender.transfer(msg.value);
        lendingRequests[msg.sender].settled = true;
    }
}