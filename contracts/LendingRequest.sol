pragma solidity ^0.5.0;

contract LendingRequest {

    /// events

    event MoneyLent( address lendingRequest, uint256 amount );
    event DebtSettled( address lendingRequest, uint256 amount );
    event MoneyWithdrawn( address lendingRequest, uint256 amount );
    event LendingRequestReset( address lendingRequest );
    event CollectContractFee( address lendingRequest, address managementAddress );
    
    /// variables

    address payable private managementContract;

    address payable public asker;
    address payable private lender;

    bool private verifiedAsker;

    uint256 public amountAsked;
    uint256 public paybackAmount;
    uint256 public contractFee;
    uint256 public creationTime;
    string public purpose;
    bool public moneyLent;
    bool public debtSettled;

    bool private withdrawnByAsker = false;
    bool public withdrawnByLender = false;

    /// constructor should only be callable by the LendingRequestFactory

    constructor
    (
        address payable _asker,
        bool _verifiedAsker,
        uint256 _amountAsked,
        uint256 _paybackAmount,
        uint256 _contractFee,
        string memory _purpose,
        address payable _managementContract
    )
        public
    {
        asker = _asker;
        lender = address(0);
        verifiedAsker = _verifiedAsker;
        amountAsked = _amountAsked;
        paybackAmount = _paybackAmount;
        contractFee = _contractFee;
        purpose = _purpose;
        creationTime = now;
        moneyLent = false;
        debtSettled = false;
        managementContract = _managementContract;
    }

    function()
        payable
        external
    {
        // prevent execution of fallback function by invalid calls
        require(msg.data.length == 0, "invalid function call");
        revert("use deposit");
    }

    function deposit(address payable _origin)
        public
        payable
        returns( bool )
    {
        /*
         * Case 1:
         *          Lending Request is being covered by lender
         *          checks:
         *              must not be covered twice
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
            require(!debtSettled, "Debt was already settled");
            require(_origin != asker, "Asker & Lender have to differ");
            require(msg.value == amountAsked, "msg.value");
            moneyLent = true;
            lender = _origin;
            emit MoneyLent(address(this), msg.value);
            return true;
        }
        else if (moneyLent && !debtSettled) {
            require(_origin == asker, "Can only be paid back by the asker");
            require(msg.value == (paybackAmount + contractFee), "not paybackAmount + contractFee");
            debtSettled = true;
            emit DebtSettled(address(this), msg.value);
            return true;
        }
        else {
            revert("Error");
        }
        return false;
    }

    function withdraw(address _origin)
        public {
        
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

        require(moneyLent, "can only be called after money was lent");
        require(lender != address(0), "lender has to be initialized");
        if (_origin == asker) {
            require(!debtSettled, "debt was settled");
            withdrawnByAsker = true;
            emit MoneyWithdrawn(address(this), address(this).balance);
            asker.transfer(address(this).balance);
        }
        else if (_origin == lender) {
            if (!debtSettled) {
                require(!withdrawnByAsker, "Asker has already withdrawn the funds");
                moneyLent = false;
                emit LendingRequestReset(address(this));
                lender.transfer(address(this).balance);
            }
            else {
                withdrawnByLender = true;
                emit MoneyWithdrawn(address(this), address(this).balance);
                lender.transfer(address(this).balance - (contractFee * 1 ether));
            }
        }
        else {
            revert("Error");
        }
    }

    function cleanUp()
        public
    {
        require(msg.sender == managementContract, "cleanUp failed");
        emit CollectContractFee(address(this), managementContract);
        selfdestruct(managementContract);
    }
}
