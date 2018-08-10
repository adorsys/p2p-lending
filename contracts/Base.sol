pragma solidity ^0.4.17;

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
        require(paybackAmount > amount + contractFee);
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
        lendingRequests[msg.sender].lender.transfer(msg.value - contractFee);
        lendingRequests[msg.sender].settled = true;
    }

    function contractFees() public view returns (uint contractfees) {
        return address(this).balance;
    }

    function withdrawFees() public onlyOwner {
      owner.transfer(address(this).balance);
    }
}
