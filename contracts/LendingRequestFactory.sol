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

    address uportRegistry = 0xdCa7EF03e98e0DC2B855bE647C39ABe984fcF21B; // Rinkeby address

    constructor( LendingBoard _LendingBoardAddress )
        public
    {
        managementContract = msg.sender;
        board = _LendingBoardAddress;
    }

    function isVerified( address _user )
        internal
        pure
        returns ( bool )
    {
        // calling uportRegistry contract without ABI
        address identityOwner = uportRegistry.call(bytes4(keccak256("identityOwner(address)")),_user);

        if ( identityOwner != _user ) {
            return true;
        }
        else {
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

}
