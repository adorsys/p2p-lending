pragma solidity ^0.5.0;

import "../Ownable.sol";
import "./LendingRequestFactory.sol";

contract RequestManagement is Ownable {
    LendingRequestFactory lendingRequestFactory;

    mapping( address => address[] ) lendingRequests;
    mapping( address => uint256 ) public openLendingRequests;

    constructor(LendingBoard _LendingBoardAddress)
        public
    {
        lendingRequestFactory = new LendingRequestFactory(_LendingBoardAddress);
    }

    function getRequests(address _user)
        public
        view
        returns( address[] memory )
    {
        require(lendingRequests[_user].length > 0, "user has no requests");
        return lendingRequests[_user];
    }

    /**
     * @notice Creates a lending request for the amount you specified
     * @param _paybackAmount has to be greater than _amount
     */

    function ask
    (
        uint256 _amount, uint256 _paybackAmount,
        string memory _purpose
    )
        public
    {
        require(_amount > 0, "invalid amount parameter");
        require(_paybackAmount > _amount, "invalid payback parameter");
        require(openLendingRequests[msg.sender] <= 5, "too many concurrent lending requests");

        // cast contract address to payable address - needs testing
        // address payable managementContract = address(uint160(address(this)));

        address request = lendingRequestFactory.newLendingRequest(
            _amount, _paybackAmount, _purpose, msg.sender);

        lendingRequests[msg.sender].push(request);
        lendingRequests[address(this)].push(request);
        openLendingRequests[msg.sender]++;
    }

    function deposit(address payable _lendingRequest)
        public
        payable
    {
        require(msg.value > 0, "cannot call deposit without sending ether");
        require(
                LendingRequest(_lendingRequest).deposit.value(msg.value)(msg.sender),
                "Deposit failed"
        );
    }

    function withdraw(address payable _lendingRequest)
        public
    {
        LendingRequest(_lendingRequest).withdraw(msg.sender);

        // cleanUp if necessary

        if(LendingRequest(_lendingRequest).withdrawnByLender()) {
            address payable asker = LendingRequest(_lendingRequest).asker();
            openLendingRequests[asker]--;
            // remove LendingRequest
            LendingRequest(_lendingRequest).cleanUp();
        }
    }

    function contractBalance()
        public
        view
        returns( uint256 ) {

        return address(this).balance;
    }

    /**
     * @dev should be called before relinquishing the contract
     */

    function withdrawFees()
        public
        onlyOwner
    {
        owner.transfer( address(this).balance );
    }

    /**
     * @dev deletes the contract and transfers all remaining
     * funds to the owner of the contract
     */

    function kill()
    public
    onlyOwner {
        selfdestruct(owner);
    }
}
