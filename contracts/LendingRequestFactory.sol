pragma solidity ^0.5.0;

import "./LendingRequest.sol";

interface LendingBoard {
    function contractFee() external view returns( uint256 );
}

contract LendingRequestFactory {

    /// events

    event RequestCreated(address request, address from, bool verified, string purpose);

    address managementContract;
    LendingBoard board;
    address uportRegistry = 0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B;

    constructor( LendingBoard _LendingBoardAddress )
    public
    {
        managementContract = msg.sender;
        board = _LendingBoardAddress;
    }

    function isVerified( address _user )
    internal
    returns ( bool )
    {
        // Calling uPort Registry Contract function
        bytes memory payload = abi.encodeWithSignature("identityOwner(address)", _user);
        (bool success, bytes memory uportAddressInBytes) = address(uportRegistry).call(payload);

        if (success) {
            address uportAddress = bytesToAddress(uportAddressInBytes);
            if (uportAddress != _user) {
                return true;
            }
            return false;
        } else {
            return false;
        }

    }


    function newLendingRequest
    (
        uint256 _amount,
        uint256 _paybackAmount,
        string memory _purpose,
        address payable _origin
    )   public
    returns ( address lendingRequest )
    {
        bool verified = isVerified(_origin);
        uint256 contractFee = board.contractFee();

        lendingRequest = address(
            new LendingRequest(
                _origin, verified, _amount, _paybackAmount,
                contractFee, _purpose, msg.sender)
        );

        emit RequestCreated(lendingRequest, _origin, verified, _purpose);
    }

    // prevent sending ether to the factory contract
    function() external {
        revert("Factory Contract does NOT accept ether");
    }

    function bytesToAddress(bytes memory bys) private pure returns (address addr) {
        assembly {
            addr := mload(add(bys,20))
        }
    }

}
