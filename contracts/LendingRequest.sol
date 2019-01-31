pragma solidity ^0.5.0;

contract LendingRequest {

    /// events

    event MoneyLent( address lendingRequest, uint256 amount );
    event DebtSettled( address lendingRequest, uint256 amount );
    event MoneyWithdrawn( address lendingRequest, uint256 amount );
    event LendingRequestReset( address lendingRequest );
    
    /// variables

    address payable private managementContract = address(0);

    address payable public asker;
    address payable public lender;

    bool private verifiedAsker;

    uint256 public amountAsked;
    uint256 public paybackAmount;
    uint256 public contractFee;

    string public purpose;
    uint256 public createdAt;
    bool public moneyLent;
    bool private withdrawnByAsker = false;
    bool public debtSettled;
    bool private withdrawnByLender = false;

    /// constructor should only be callable by the LendingRequestFactory

    constructor(
        address payable _asker,
        bool _verifiedAsker,
        uint256 _amountAsked,
        uint256 _paybackAmount,
        uint256 _contractFee,
        string memory _purpose
    ) public {
        asker = _asker;
        lender = address(0);
        verifiedAsker = _verifiedAsker;
        amountAsked = _amountAsked;
        paybackAmount = _paybackAmount;
        contractFee = _contractFee;
        purpose = _purpose;
        createdAt = now;
        moneyLent = false;
        debtSettled = false;
    }

    /**
     * @dev Regulate payment conditions of the LendingRequest
     */
    
    function()
        payable
        external {

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
         *
         * Think about moving the code to separate deposit function and disable functionality to receive funds via the fallback function
         */

        if ( !moneyLent ) {
            require( !debtSettled, "Debt was already settled" );
            require( msg.sender != asker, "Asker & Lender have to differ" );
            require( msg.value == amountAsked * 1 ether, "not the amount asked for" );
            moneyLent = true;
            lender = msg.sender;
            emit MoneyLent( address(this), msg.value);
        }
        else if ( moneyLent && !debtSettled ) {
            require( msg.sender == asker, "Can only be paid back by the asker" );
            require( msg.value == ( paybackAmount + contractFee ) * 1 ether, "not payback + contractFee" );
            debtSettled = true;
            emit DebtSettled( address(this), msg.value);
        }
        else {
            revert( "Error" );
        }
    }

    function withdraw()
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

        require( moneyLent, "can only be called after money was lent" );
        require( this.lender() != address(0), "lender has to be initialized" );
        if ( msg.sender == this.asker() ) {
            require(!debtSettled, "debt was settled");
            withdrawnByAsker = true;
            emit MoneyWithdrawn( address(this), address(this).balance );
            this.asker().transfer( address(this).balance );
        }
        else if ( msg.sender == this.lender() ) {
            if ( !debtSettled ) {
                require( !withdrawnByAsker, "Asker has already withdrawn the funds" );
                moneyLent = false;
                emit LendingRequestReset( address(this) );
                this.lender().transfer( address(this).balance );
            }
            else {
                withdrawnByLender = true;
                emit MoneyWithdrawn( address(this), address(this).balance );
                this.lender().transfer( address(this).balance - contractFee );
                // FIXME: Add address of Management contract to cleanUp()
                cleanUp();
            }
        }
        else {
            revert( "Error" );
        }
    }

    function cleanUp()
        public
    {
        // add management contract address
        selfdestruct( msg.sender );
    }
}