pragma solidity ^0.5.0;

import "./LendingRequest.sol";

contract LendingRequestFactory {

    /// events

    event RequestCreated(address request, address from, bool verified, string purpose);

    mapping( address => address[] ) requests;
    uint256 public contractFee = 1000;

    function getRequests( address _user )
        public
        view
        returns ( address[] memory )
    {
        return requests[_user];
    }

    function newLendingRequest
    ( 
        uint256 _amount,
        uint256 _paybackAmount,
        string memory _purpose
    )   public
        returns ( address lendingRequest )
    {
        // create new Lending Request
        // check if msg.sender is verified
        bool verified = false;

        lendingRequest = address(
            new LendingRequest(
                msg.sender, verified, _amount, _paybackAmount,
                contractFee, _purpose)
        );

        // add LendingRequest to LendingRequests control structure

        requests[msg.sender].push(lendingRequest);
        requests[address(this)].push(lendingRequest);

        // trigger Event
        emit RequestCreated(lendingRequest, msg.sender, verified, _purpose);
    }

    // prevent sending ether to the factory contract
    function() external {
        revert("Factory Contract does NOT accept ether");
    }

}