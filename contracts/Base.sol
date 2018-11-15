pragma solidity ^0.4.4;
pragma experimental ABIEncoderV2;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;


  event OwnershipRenounced(address indexed previousOwner);
  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to relinquish control of the contract.
   * @notice Renouncing to ownership will leave the contract without an owner.
   * It will not be possible to call the functions with the `onlyOwner`
   * modifier anymore.
   */
  function renounceOwnership() public onlyOwner {
    emit OwnershipRenounced(owner);
    owner = address(0);
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    _transferOwnership(_newOwner);
  }

  /**
   * @dev Transfers control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function _transferOwnership(address _newOwner) internal {
    require(_newOwner != address(0));
    emit OwnershipTransferred(owner, _newOwner);
    owner = _newOwner;
  }
}

contract Base is Ownable {

    uint contractFee = 1000;
    uint lendingRequestCount = 0;

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

    mapping(address => uint[]) private userRequests;
    LendingRequest[] public lendingRequests;

    constructor() public {
    }

    function getUserRequests() public view returns (uint[]) {
        return userRequests[msg.sender];
    }

    function getLendingRequests() public view returns (LendingRequest[]) {
        return lendingRequests;
    }

    function getLendingRequestsByUser(address user) public view returns (LendingRequest[]) {
        uint[] memory myRequests = userRequests[user];
        LendingRequest[] memory fullRequests = new LendingRequest[](myRequests.length);
        for (uint i = 0; i < myRequests.length; i++) {
            fullRequests[i] = lendingRequests[myRequests[i]];
        }
        return fullRequests;
    }

    function getMyLendingRequests() public view returns (LendingRequest[]) {
        getLendingRequestsByUser(msg.sender);
    }

    function ask(uint amount, uint paybackAmount, string purpose) public returns (uint contractId ){
        require(amount > 0);
        require(paybackAmount > amount + contractFee);
        require(userRequests[msg.sender].length == 0);

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

        userRequests[msg.sender].push(lendingRequestCount);
        lendingRequests.push(request);
        lendingRequestCount++;
        return lendingRequestCount;
    }

    function lend(uint id) public payable {
        require(lendingRequests[id].asker != msg.sender);
        require(!lendingRequests[id].lent);
        require(lendingRequests[id].amount == msg.value);

        lendingRequests[id].asker.transfer(msg.value);
        lendingRequests[id].lent = true;
    }

    function settle(uint id) public payable {
        require(lendingRequests[id].lent);
        require(!lendingRequests[id].settled);
        require(lendingRequests[id].lender != msg.sender);
        require(lendingRequests[id].paybackAmount == msg.value);

        lendingRequests[id].lender.transfer(msg.value - contractFee);
        lendingRequests[id].settled = true;
    }

    function contractFees() public view returns (uint contractfees) {
        return address(this).balance;
    }

    function withdrawFees() public onlyOwner {
        owner.transfer(address(this).balance);
    }
}
