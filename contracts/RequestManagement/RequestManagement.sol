pragma solidity ^0.5.0;

interface RequestFactoryInterface {
    function createLendingRequest(uint256, uint256, string calldata, address payable) external returns(address);
}

interface LendingRequestInterface {
    function deposit(address payable) external payable returns(bool, bool);
    function withdraw(address) external;
    function cleanUp() external;
    function cancelRequest() external;
    function asker() external view returns(address payable);
    function withdrawnByLender() external view returns(bool);
    function getRequestParameters() external view returns(address payable, address payable, uint256, uint256, uint256, string memory);
    function getRequestState() external view returns(bool, bool, bool, bool);
}

contract RequestManagement {
    event RequestCreated();
    event RequestGranted();
    event DebtPaid();
    event Withdraw();

    mapping(address => uint256) private requestIndex;
    mapping(address => uint256) private userRequestCount;
    mapping(address => bool) private validRequest;

    address private requestFactory;
    address[] private lendingRequests;

    constructor(address _factory) public {
        requestFactory = _factory;
    }

    /**
     * @notice Creates a lending request for the amount you specified
     * @param _amount the amount you want to borrow in Wei
     * @param _paybackAmount the amount you are willing to pay back - has to be greater than _amount
     * @param _purpose the reason you want to borrow ether
     */
    function ask (uint256 _amount, uint256 _paybackAmount, string memory _purpose) public {
        // validate the input parameters
        require(_amount > 0, "invalid amount");
        require(_paybackAmount > _amount, "invalid payback");
        // require(lendingRequests[msg.sender].length < 5, "too many requests");
        require(userRequestCount[msg.sender] < 5, "too many requests");

        // create new lendingRequest
        address request = RequestFactoryInterface(requestFactory).createLendingRequest(
            _amount,
            _paybackAmount,
            _purpose,
            msg.sender
        );

        // update number of requests for asker
        userRequestCount[msg.sender]++;
        // add created lendingRequest to management structures
        requestIndex[request] = lendingRequests.length;
        lendingRequests.push(request);
        // mark created lendingRequest as a valid request
        validRequest[request] = true;

        emit RequestCreated();
    }

    /**
     * @notice Lend or payback the ether amount of the lendingRequest (costs ETHER)
     * @param _lendingRequest the address of the lendingRequest you want to deposit ether in
     */
    function deposit(address payable _lendingRequest) public payable {
        // validate input
        require(validRequest[_lendingRequest], "invalid request");
        require(msg.value > 0, "invalid value");

        (bool lender, bool asker) = LendingRequestInterface(_lendingRequest).deposit.value(msg.value)(msg.sender);
        require(lender || asker, "Deposit failed");

        if (lender) {
            emit RequestGranted();
        } else if (asker) {
            emit DebtPaid();
        }
    }

    /**
     * @notice withdraw Ether from the lendingRequest
     * @param _lendingRequest the address of the lendingRequest to withdraw from
     */
    function withdraw(address payable _lendingRequest) public {
        // validate input
        require(validRequest[_lendingRequest], "invalid request");

        LendingRequestInterface(_lendingRequest).withdraw(msg.sender);

        // if paybackAmount was withdrawn by lender reduce number of openRequests for asker
        if(LendingRequestInterface(_lendingRequest).withdrawnByLender()) {
            address payable asker = LendingRequestInterface(_lendingRequest).asker();
            // call selfdestruct of lendingRequest
            LendingRequestInterface(_lendingRequest).cleanUp();
            // remove lendingRequest from managementContract
            removeRequest(_lendingRequest, asker);
        }

        emit Withdraw();
    }

    /**
     * @notice cancels the request
     * @param _lendingRequest the address of the request to cancel
     */
    function cancelRequest(address payable _lendingRequest) public {
        // validate input
        require(validRequest[_lendingRequest], "invalid Request");

        LendingRequestInterface(_lendingRequest).cancelRequest();
        removeRequest(_lendingRequest, msg.sender);

        emit Withdraw();
    }

    /**
     * @notice gets the lendingRequests for the specified user
     * @return all lendingRequests
     */
    function getRequests() public view returns(address[] memory) {
        return lendingRequests;
    }

    /**
     * @notice gets askAmount, paybackAmount and purpose to given proposalAddress
     * @param _lendingRequest the address to get the parameters from
     * @return asker address of the asker
     * @return lender address of the lender
     * @return askAmount of the proposal
     * @return paybackAmount of the proposal
     * @return contractFee the contract fee for the lending request
     * @return purpose of the proposal
     * @return lent wheather the money was lent or not
     * @return debtSettled wheather the debt was settled by the asker
     */
    function getRequestParameters(address payable _lendingRequest)
        public
        view
        returns (address asker, address lender, uint256 askAmount, uint256 paybackAmount, uint256 contractFee, string memory purpose) {
        (asker, lender, askAmount, paybackAmount, contractFee, purpose) = LendingRequestInterface(_lendingRequest).getRequestParameters();
    }

    function getRequestState(address payable _lendingRequest)
        public
        view
        returns (bool verifiedAsker, bool lent, bool withdrawnByAsker, bool debtSettled) {
        return LendingRequestInterface(_lendingRequest).getRequestState();
    }

    /**
     * @notice removes the lendingRequest from the management structures
     * @param _request the lendingRequest that will be removed
     */
    function removeRequest(address _request, address _sender) private {
        // validate input
        require(validRequest[_request], "invalid request");

        // update number of requests for asker
        userRequestCount[_sender]--;
        // remove _request from the management contract
        uint256 idx = requestIndex[_request];
        if(lendingRequests[idx] == _request) {
            requestIndex[lendingRequests[lendingRequests.length - 1]] = idx;
            lendingRequests[idx] = lendingRequests[lendingRequests.length - 1];
            lendingRequests.pop();
        }
        // mark _request as invalid lendingRequest
        validRequest[_request] = false;
    }
}
