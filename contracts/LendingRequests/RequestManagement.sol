pragma solidity ^0.5.0;

import "../Ownable.sol";
import "./LendingRequestFactory.sol";

// TODO: change RequestManagement to use deployed RequestFactory via call
/// @author 
contract RequestManagement is Ownable {
    LendingRequestFactory lendingRequestFactory;

    mapping(address => address[]) private lendingRequests;
    mapping(address => bool) private validRequest;

    constructor(LendingBoard _LendingBoardAddress, address payable _trustToken) public {
        lendingRequestFactory = new LendingRequestFactory(_LendingBoardAddress, _trustToken);
    }

    /**
     * @notice Creates a lending request for the amount you specified
     * @param _amount the amount you want to borrow in Wei
     * @param _paybackAmount the amount you are willing to pay back - has to be greater than _amount
     * @param _purpose the reason you want to borrow ether
     */
    function ask (uint256 _amount, uint256 _paybackAmount, string memory _purpose) public {
        // validate the input parameters
        require(_amount > 0, "invalid amount parameter");
        require(_paybackAmount > _amount, "invalid payback parameter");
        require(lendingRequests[msg.sender].length < 5, "too many concurrent lending requests");

        // create new lendingRequest via factory contract
        address request = lendingRequestFactory.newLendingRequest(_amount, _paybackAmount, _purpose, msg.sender);

        // add created lendingRequest to management structures
        lendingRequests[msg.sender].push(request);
        lendingRequests[address(this)].push(request);

        // mark created lendingRequest as a valid request
        validRequest[request] = true;
    }

    /**
     * @notice Lend or payback the ether amount of the lendingRequest (costs ETHER)
     * @param _lendingRequest the address of the lendingRequest you want to deposit ether in
     */
    function deposit(address payable _lendingRequest) public payable {
        require(validRequest[_lendingRequest], "invalid request");
        require(msg.value > 0, "cannot call deposit without sending ether");
        require(
                LendingRequest(_lendingRequest).deposit.value(msg.value)(msg.sender),
                "Deposit failed"
        );
    }

    /**
     * @notice withdraw Ether from the lendingRequest
     * @param _lendingRequest the address of the lendingRequest to withdraw from
     */
    function withdraw(address payable _lendingRequest) public {
        require(validRequest[_lendingRequest], "invalid request");

        LendingRequest(_lendingRequest).withdraw(msg.sender);
        
        // if paybackAmount was withdrawn by lender reduce number of openRequests for asker
        if(LendingRequest(_lendingRequest).withdrawnByLender()) {
            address payable asker = LendingRequest(_lendingRequest).asker();

            // call selfdestruct of lendingRequest
            LendingRequest(_lendingRequest).cleanUp();

            // remove lendingRequest from managementContract
            removeRequest(_lendingRequest, asker);
        }
    }

    /**
     * @notice transfers current contract balance to the owner of the contract
     * @dev should be called before relinquishing the contract
     */
    function withdrawFees() public onlyOwner {
        owner.transfer(address(this).balance);
    }

    /**
     * @notice Destroys the management contract
     * @dev deletes the contract and transfers the contract balance to the owner
     */
    function kill() public onlyOwner {
        selfdestruct(owner);
    }

    /**
     * @notice gets the lendingRequests for the specified user
     * @param _user user you want to see the lendingRequests of
     * @return the lendingRequests for _user
     */
    function getRequests(address _user) public view returns(address[] memory) {
        address[] memory empty = new address[](0);
        return lendingRequests[_user].length != 0 ? lendingRequests[_user] : empty;
    }

    /**
     * @notice get the current ether balance of the management contract
     * @return current balance of the contract
     */
    function contractBalance() public onlyOwner view returns(uint256) {
        return address(this).balance;
    }

    /**
     * @notice gets askAmount, paybackAmount and purpose to given proposalAddress
     * @param _lendingRequest the address to get the parameters from
     * @return askAmount of the proposal
     * @return paybackAmount of the proposal
     * @return purpose of the proposal
     */
    function getProposalParameters(address payable _lendingRequest)
        public
        view
        returns (
            address asker,
            uint256 askAmount,
            uint256 paybackAmount,
            uint256 contractFee,
            string memory purpose
        ) {
        asker = LendingRequest(_lendingRequest).asker();
        askAmount = LendingRequest(_lendingRequest).amountAsked();
        paybackAmount = LendingRequest(_lendingRequest).paybackAmount();
        contractFee = LendingRequest(_lendingRequest).contractFee();
        purpose = LendingRequest(_lendingRequest).purpose();
    }

    /**
     * @notice removes the lendingRequest from the management structures
     * @param _request the lendingRequest that will be removed
     * @param _asker the author of _request
     */
    function removeRequest(address payable _request, address _asker) private {
        require(validRequest[_request], "invalid request");
        // remove _request for asker
        for(uint256 i = 0; i < lendingRequests[_asker].length; i++) {
            address currentRequest = lendingRequests[_asker][i];
            if(currentRequest == _request) {
                for(uint256 j = i; j < lendingRequests[_asker].length - 1; j++) {
                    lendingRequests[_asker][j] = lendingRequests[_asker][j + 1];
                }
                // removes last element of storage array
                lendingRequests[_asker].pop();
                break;
            }
        }
        // remove _request from the management contract
        for(uint256 i = 0; i < lendingRequests[address(this)].length; i++) {
            address currentRequest = lendingRequests[address(this)][i];
            if(currentRequest == _request) {
                for(uint256 j = i; j < lendingRequests[address(this)].length - 1; j++) {
                    lendingRequests[address(this)][j] = lendingRequests[address(this)][j + 1];
                }
                // removes last element of storage array
                lendingRequests[address(this)].pop();
                break;
            }
        }
        // mark _request as invalid lendingRequest
        validRequest[_request] = false;
    }
}
