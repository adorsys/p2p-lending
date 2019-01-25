pragma solidity ^0.5.0;
// pragma experimental ABIEncoderV2;

import "./Ownable.sol";

interface LendingBoard {
    function contractFee() external pure returns( uint256 );
}

contract Base is Ownable {

    uint256 lendingRequestCount = 0;
    LendingBoard board;

    struct LendingRequest {
        address payable asker;
        uint amount;
        uint paybackAmount;
        address payable lender;
        bool settled;
        string purpose;
        bool lent;
        uint creationTime;
    }

    mapping(address => uint[]) private userRequests;
    LendingRequest[] public lendingRequests;

    constructor(LendingBoard _address)
        public {

        board = _address;
    }

    function getContractFee()
        public
        view
        returns (uint256) {

        return board.contractFee();
    }

    /**
     * @notice Creates a lending request for the amount you specified
     */

    function ask(uint amount, uint paybackAmount, string memory purpose)
        public
        returns (uint) {

        require(amount > 0, "you need to ask for money");
        require(paybackAmount >= amount + getContractFee(), "minimum amount is amount + contractFee");

        LendingRequest memory request = LendingRequest({
            asker: msg.sender,
            amount: amount,
            paybackAmount: paybackAmount,
            lender: address(0),
            settled: false,
            purpose: purpose,
            lent: false,
            creationTime: now
            });

        userRequests[msg.sender].push(lendingRequestCount);
        lendingRequests.push(request);
        lendingRequestCount++;
        return lendingRequestCount;
    }

    /**
     * @notice Lend the amount of ether you send to the lending request with the ID you specified
     */

    function lend(uint id)
        public
        payable {

        require(lendingRequests[id].asker != msg.sender, "you cannot lend money to yourself");
        require(!lendingRequests[id].lent, "request was already served");
        require(lendingRequests[id].amount == msg.value, "provided amount has to be equal to the amount asked for");

        lendingRequests[id].asker.transfer(msg.value);
        lendingRequests[id].lent = true;
    }

    /**
     * @notice settle the lending request with the ID you specified
     */

    function settle(uint id)
        public
        payable {

        require(lendingRequests[id].lent, "cannot be settled before money was lent");
        require(!lendingRequests[id].settled, "was already settled");
        require(lendingRequests[id].lender != msg.sender, "no lending money to yourself");
        require(lendingRequests[id].paybackAmount == msg.value, "payback amount has to be equal to the amount agreed upon");

        lendingRequests[id].lender.transfer(msg.value - getContractFee());
        lendingRequests[id].settled = true;
    }

    function contractBalance()
        public
        view
        returns (uint) {

        return address(this).balance;
    }

    /**
     * @dev should be called before relinquishing the contract
     */

    function withdrawFees()
        public
        onlyOwner {

        owner.transfer(address(this).balance);
    }

    /**
     * @dev deletes the contract from the chain and transfers all remaining
     * funds to the owner of the contract
     */

    function kill()
    public
    onlyOwner {
        selfdestruct(owner);
    }
}
