pragma solidity ^0.5.0;

contract LendingRequest {
    address payable private managementContract;
    address payable private trustToken;
    address payable public asker;
    address payable public lender;
    bool private withdrawnByAsker;
    bool public withdrawnByLender;
    bool private verifiedAsker;
    bool public moneyLent;
    bool public debtSettled;
    uint256 public amountAsked;
    uint256 public paybackAmount;
    uint256 public contractFee;
    string public purpose;

    constructor(
        address payable _asker,
        bool _verifiedAsker,
        uint256 _amountAsked,
        uint256 _paybackAmount,
        uint256 _contractFee,
        string memory _purpose,
        address payable _managementContract,
        address payable _trustToken
    ) public {
        asker = _asker;
        verifiedAsker = _verifiedAsker;
        amountAsked = _amountAsked;
        paybackAmount = _paybackAmount;
        contractFee = _contractFee;
        purpose = _purpose;
        managementContract = _managementContract;
        trustToken = _trustToken;
    }

    /**
     * @notice deposit the ether that is being sent with the function call
     * @param _origin the address of the initial caller of the function
     * @return true on success - false otherwise
     */
    function deposit(address payable _origin) external payable returns (bool originIsLender, bool originIsAsker) {
        /*
         * Case 1:
         *          Lending Request is being covered by lender
         *          checks:
         *              must not be covered twice (!moneyLent)
         *              must not be covered if the debt has been settled
         *              must not be covered by the asker
         *              has to be covered with one transaction
         * Case 2:
         *          Asker pays back the debt
         *          checks:
         *              cannot pay back the debt if money has yet to be lent
         *              must not be paid back twice
         *              has to be paid back by the asker
         *              must be paid back in one transaction and has to include contractFee
         */
        if (!moneyLent) {
            require(_origin != asker, "invalid lender");
            require(msg.value == amountAsked, "msg.value");
            moneyLent = true;
            lender = _origin;
            originIsLender = true;
            originIsAsker = false;
        } else if (moneyLent && !debtSettled) {
            require(_origin == asker, "invalid paybackaddress");
            require(msg.value == (paybackAmount + contractFee), "invalid payback");
            debtSettled = true;
            originIsLender = false;
            originIsAsker = true;
        } else {
            revert("Error");
        }
    }

    /**
     * @notice withdraw the current balance of the contract
     * @param _origin the address of the initial caller of the function
     */
    function withdraw(address _origin) external {
        /*
         * Case 1: ( asker withdraws amountAsked )
         *      checks:
         *          must only be callable by asker
         *          money has to be lent first
         * Case 2.1: ( lender withdraws amountAsked )
         *      checks:
         *          must only be callable by the lender
         *          asker must not have withdrawn amountAsked
         *      reset moneyLent status
         * Case 2.2: ( lender withdraws paybackAmount )
         *      checks:
         *          must only be callable by the lender
         *          debt has to be repaid first
         *      contractFee has to remain with the contract
         */
        require(moneyLent, "invalid state");
        require(lender != address(0), "invalid lender");
        if (_origin == asker) {
            require(!debtSettled, "debt settled");
            withdrawnByAsker = true;
            asker.transfer(address(this).balance);
        } else if (_origin == lender) {
            if (!debtSettled) {
                require(!withdrawnByAsker, "WithdrawnByAsker");
                moneyLent = false;
                lender.transfer(address(this).balance);
                lender = address(0);
            } else {
                withdrawnByLender = true;
                lender.transfer(address(this).balance - contractFee);
            }
        } else {
            revert("Error");
        }
    }

    /**
     * @notice destroys the lendingRequest contract and forwards all remaining funds to the management contract
     */
    function cleanUp() external {
        require(msg.sender == managementContract, "cleanUp failed");
        selfdestruct(trustToken);
    }

    /**
     * @notice cancels the request if possible
     */
    function cancelRequest() external {
        require(msg.sender == managementContract, "invalid caller");
        require(moneyLent == false && debtSettled == false, "invalid conditions");
        selfdestruct(asker);
    }

    /**
     * @notice getter for all relevant information of the lending request
     */
    function getRequestParameters() external view
        returns (address payable, address payable, uint256, uint256, uint256, string memory) {
        return (asker, lender, amountAsked, paybackAmount, contractFee, purpose);
    }

    /**
     * @notice getter for proposal state
     */
    function getRequestState() external view returns (bool, bool, bool, bool) {
        return (verifiedAsker, moneyLent, withdrawnByAsker, debtSettled);
    }
}
