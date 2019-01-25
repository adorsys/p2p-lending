pragma solidity ^0.5.0;

contract LendingRequest {

    /// events

    event MoneyLent(address from, uint256 amount);
    event DebtSettled(address from, uint256 amount);
    event MoneyWithdrawn(address from, uint256 amount);
    
    /// variables

    address payable public asker;
    address payable public lender;

    bool public verifiedAsker;

    uint256 public amountAsked;
    uint256 public paybackAmount;
    uint256 public contractFee;

    string public purpose;
    uint256 public createdAt;
    bool public moneyLent;
    bool public debtSettled;

    // constructor should only be callable by the LendingRequestFactory 
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

    // accept ether
    function()
        payable
        external {

        // if request is still open only accept full amount asked for
        if (!moneyLent && msg.value != amountAsked) {
            revert();
        } else if (moneyLent && !debtSettled && msg.value != (paybackAmount + contractFee)) {
            revert();
        } else if (moneyLent && debtSettled) {
            revert();
        } else {
            if (!moneyLent && msg.value == amountAsked) {
                moneyLent = true;
                lender = msg.sender;
                emit MoneyLent(msg.sender, msg.value);
            } else if (moneyLent && !debtSettled && msg.value == (paybackAmount + contractFee)) {
                debtSettled = true;
                emit DebtSettled(msg.sender, msg.value);
            }
            
        }    
    }

    function withdraw()
        public {

        // only allow asker and lender to withdraw money depending on internal state
        // allow the lender to withdraw the money if whole sum is still available

        // transfer the money depending on internal state 
        if (!moneyLent) {
            revert();
        } else {
            if (moneyLent) {
                require((msg.sender == asker) || (msg.sender == lender),
                        "You need to be the asker or the lender to withdraw ether");
                if (debtSettled) {
                    require(msg.sender == lender, "Only Lender can withdraw payback amount");

                    // add functionality to transfer the contractFee to the Factory Contract
                    // this transfers all the funds to the lender ( including the contractFee (!) )
                    msg.sender.transfer(address(this).balance);
                } else {
                    if (msg.sender == lender) {
                        moneyLent = false;
                        emit MoneyWithdrawn(msg.sender, address(this).balance);
                    }
                    msg.sender.transfer(address(this).balance);
                }
            }
        }

    }
}