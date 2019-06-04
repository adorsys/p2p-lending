pragma solidity ^0.5.0;

import "./LendingRequest.sol";

interface TrustTokenInterface {
    function isTrustee(address) external view returns(bool);
}

interface ProposalManagementInterface {
    function memberId(address) external view returns(uint256);
    function contractFee() external view returns(uint256);
}

contract RequestFactory {
    address payable private trustToken;
    address private proposalManagement;

    constructor(address payable _trustToken, address _proposalManagement) public {
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
    function createLendingRequest(
        uint256 _amount,
        uint256 _paybackAmount,
        string memory _purpose,
        address payable _origin
    ) public returns (address lendingRequest) {
        // check if asker is verifyable
        bool verified = TrustTokenInterface(address(trustToken)).isTrustee(_origin);
        verified = verified || ProposalManagementInterface(proposalManagement).memberId(_origin) != 0;
        uint256 contractFee = ProposalManagementInterface(proposalManagement).contractFee();

        // create new lendingRequest contract
        lendingRequest = address(
            new LendingRequest(
                _origin, verified, _amount, _paybackAmount,
                contractFee, _purpose, msg.sender, trustToken)
        );
    }
}
