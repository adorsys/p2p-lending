pragma solidity ^0.5.0;

import "./LendingRequest.sol";

interface LendingBoard {
    function contractFee() external view returns( uint256 );
}

contract LendingRequestFactory {
    address private managementContract;
    LendingBoard private board;

    event RequestCreated(address request, address from, bool verified, string purpose);

    function() external payable {
        revert("Factory Contract does NOT accept ether");
    }

    constructor(LendingBoard _LendingBoardAddress) public {
        managementContract = msg.sender;
        board = _LendingBoardAddress;
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

        // get contractFee from lendingBoard
        uint256 contractFee = board.contractFee();
        
        // create new lendingRequest contract
        lendingRequest = address(
            new LendingRequest(
                _origin, verified, _amount, _paybackAmount,
                contractFee, _purpose, msg.sender)
        );
        emit RequestCreated(lendingRequest, _origin, verified, _purpose);
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
