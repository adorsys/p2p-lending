pragma solidity ^0.5.0;

import "./LendingRequest.sol";

contract LendingRequestFactory {
    address private managementContract;
    address payable private trustToken;
    address private proposalManagement;

    event Test(uint256 memberid);

    function() external payable {
        revert("Factory Contract does NOT accept ether");
    }

    constructor(address payable _trustToken, address _proposalManagement) public {
        managementContract = msg.sender;
        trustToken = _trustToken;
        proposalManagement = _proposalManagement;
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

        uint256 contractFee = getContractFee();
        
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
    function isVerified(address _user) internal returns (bool) {
        /// try to verifiy by checking if _user is trustToken holder
        // prepare payload: bytes4 representation of the hashed function signature
        bytes memory payload = abi.encodeWithSignature("balanceOf(address)", _user);
        // execute and get encoded return value of function call
        (bool success, bytes memory encodedReturn) = trustToken.call(payload);
        // check if query was successfull
        require(success, "could not communicate with trustToken contract");
        // decode trustToken balance of user
        uint256 balance = abi.decode(encodedReturn, (uint256));

        if (balance > 0) {
            return true;
        } else {
            /// try to verify user by getting membership status from proposalManagement
            // prepare payload: bytes4 representation of the hashed function signature
            payload = abi.encodeWithSignature("memberId(address)", _user);
            // execute and get encoded return value of function call
            (success, encodedReturn) = proposalManagement.call(payload);
            // check if query was successfull
            require(success, "could not get membership status for user");
            // decode memberId
            uint256 memberId = abi.decode(encodedReturn, (uint256));

            emit Test(memberId);
            
            if (memberId != 0) {
                return true;
            } else {
                return false;
            }
        }
        // TODO: Uport verification
    }

    /**
     * @notice gets the current contract fee from proposalManagement
     * @return returns the contract fee
     */
    function getContractFee() private returns (uint256) {
        bytes memory payload = abi.encodeWithSignature("contractFee()");
        (bool success, bytes memory encodedReturn) = proposalManagement.call(payload);
        require(success, "could not get contract fee");
        return abi.decode(encodedReturn, (uint256));
    }
}
