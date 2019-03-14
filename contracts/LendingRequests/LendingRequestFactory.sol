pragma solidity ^0.5.0;

import "./LendingRequest.sol";

contract LendingRequestFactory {
    address private managementContract;
    address payable private trustToken;

    uint256 private contractFee;

    function() external payable {
        revert("Factory Contract does NOT accept ether");
    }

    constructor(address payable _trustToken) public {
        managementContract = msg.sender;
        contractFee = 1000;
        trustToken = _trustToken;
    }

    /**
     * @notice creates a new lendingRequest
     * @param _amount the amount the asker wants to borrow
     * @param _paybackAmount the amoun the asker is willing to pay the lender after getting the loan
     * @param _purpose the reason the asker wants to borrow money
     * @param _origin origin address of the call -> address of the asker
     */
    function newLendingRequest( 
        uint256 _amount,
        uint256 _paybackAmount,
        string calldata _purpose,
        address payable _origin
    ) external returns (address lendingRequest) {  
        // check if asker is verifyable 
        bool verified = isVerified(_origin);
        
        // create new lendingRequest contract
        lendingRequest = address(
            new LendingRequest(
                _origin, verified, _amount, _paybackAmount,
                contractFee, _purpose, msg.sender, trustToken)
        );
    }

    /**
     * @notice checks if the user is known via uPort
     * @param _user address of the user to be verified
     */
    function isVerified(address _user) internal pure returns (bool) {
        // TODO: Uport verification
        if(_user != address(0)) {
            return true;
        }
        else {
            return false;
        }
    }
}
