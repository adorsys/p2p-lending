/**
 * Directory: P2P-Lending/contracts/IcoContract/TrustToken.sol
 * Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 */

pragma solidity ^0.5.0;                                                                             // Solidity compiler version
import "./EIP20Interface.sol";
import "../SafeMath.sol";

contract TrustToken is EIP20Interface {
    using SafeMath for uint256;

    /**
     * @notice Checks if caller is a Trustee
     */
    modifier isTrusteeMod {
        require(isTrustee[msg.sender], "invalid caller");
        _;
    }

    /**
     * @notice Checkss if '_add' is the address of ProposalManagement
     */
    modifier calledByProposalManagement {
        require(msg.sender == proposalManagement, "invalid caller");
        _;
    }

    mapping (address => bool) public isUserLocked;                                                  // to check if token of address are locked
    mapping (address => uint256) private tokenBalances;                                             // token balances of all Trustees
    mapping (address => uint256) public etherBalances;                                              // ether balances of all Trustees
    mapping (address => mapping (address => uint256)) public allowed;                               // register of all permissions form one user to another
    mapping (address => bool) public isTrustee;                                                     // proof an adress is a Trustee

    address public proposalManagement;                                                              // address of ProposalManagement
    address[] public participants;                                                                  // list of all Trustees

    string public name;                                                                             // name: eg TrustToken
    string public symbol;                                                                           // An identifier: eg TT

    uint256 public totalSupply;                                                                     // total amount of tokens
    uint256 public trusteeCount;                                                                    // number of trustees
    uint256 public goal = 10 ether;                                                                 // goal of ehter to reach
    uint256 public contractEtherBalance;                                                            // total ether balance of this contract
    uint8 public decimals;                                                                          // How many decimals to show

    bool public isIcoActive;                                                                        // checks if ICO is active or not

    /// Display transactions and approvals
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    /// Track Participation && ICO Status
    event Participated(address buyer);
    event ICOFinished(address icoAddress);

    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) public {
        name = _tokenName;                                                                          // Set the name of tokens for display purposes
        decimals = _decimalUnits;                                                                   // Amount of decimals for display purposes
        symbol = _tokenSymbol;                                                                      // Set the symbol for display purposes
        totalSupply = _initialAmount.mul(10 ** uint256(decimals));                                  // Set total supply of tokens
        isIcoActive = true;                                                                         // Mark ICO as active
    }

    /**
     * @notice Sets the proposalManagement address
     * @param _management The address of the proposalManagement
     */
    function setManagement(address _management) external {
        if (proposalManagement != address(0)) {
            require(msg.sender == proposalManagement, "invalid caller");
        }
        proposalManagement = _management;
    }

    /**
     * @notice Creates a proposal contract to change membership status for the member
     * @param _memberAddress The address of the member
     * @param _adding True if member is to be added false otherwise
     * @dev Only callable by Trustees
     */
    function createMemberProposal(address _memberAddress, bool _adding) external isTrusteeMod {
        bytes memory payload = abi.encodeWithSignature(
            "createMemberProposal(address,bool,uint256)",
            _memberAddress,
            _adding,
            trusteeCount
        );
        (bool success, ) = proposalManagement.call(payload);
        require(success, "createMemberProposal failed");
    }

    /**
     * @notice Vote for a proposal at '_proposalAddress' with '_stance'
     * @param _stance True if you want to cast a positive vote, false otherwise
     * @param _proposalAddress The address of the proposal you want to vote for
     * @dev isTrusteeMod Only callable by Trustess 
     */
    function vote(bool _stance, address _proposalAddress) external isTrusteeMod {
        lockUser(msg.sender);
        bytes memory payload = abi.encodeWithSignature(
            "vote(bool,address,address)",
            _stance,
            _proposalAddress,
            msg.sender
        );
        (bool success, ) = proposalManagement.call(payload);
        require(success, "ICO vote failed");
    }

    /**
     * @notice Unlocks token of a list of users
     * @param _users List of users to unlock
     * @dev calledByLB Only callable by Trustess 
     */
    function unlockUsers(address[] calldata _users) external calledByProposalManagement {
        for(uint256 i; i < _users.length; i++) {
            unlockUser(_users[i]);
        }
    }

    /**
     * @notice Invest Ether to become a Trustee and get token when ICO finishes
     */
    function participate () external payable {
        require(isIcoActive, "ICO inactive");
        uint256 allowedToAdd = msg.value;                                                           // the value of 'allowedToAdd' will be added to the balance ot the contract
        uint256 returnAmount;                                                                       // ether to return when goal is reached

        if( (contractEtherBalance.add(msg.value)) > goal) {
            allowedToAdd = goal.sub(contractEtherBalance);                                          // 'allowedToAdd' is equal to the amount of Ether which can be added to reach the 'goal'
            returnAmount = msg.value.sub(allowedToAdd);                                             // save the amount of ether that is to be returned afterwards
        }

        etherBalances[msg.sender] = etherBalances[msg.sender].add(allowedToAdd);                    //add to senders ether_balance
        contractEtherBalance = contractEtherBalance.add(allowedToAdd);                              // add to contract_balance
            
        if(!isTrustee[msg.sender]) {                                                                // checks if 'msg.sender' is a Trustee
            participants.push(msg.sender);                                                          //msg.sender to be Trustee
            isTrustee[msg.sender] = true;                                                           //msg.sender is Trustee
        }

        emit Participated(msg.sender);
        
        if(contractEtherBalance >= goal) {                                                          // if goal was reached and ico is still active, then distrube token to all Trustees
            distributeToken();                                                                      // distribute all tokens to all Trustees
            isIcoActive = false;                                                                    // ICO is not active anymore
            trusteeCount = participants.length;
            emit ICOFinished(address(this));
        }
        
        if (returnAmount > 0) {
            msg.sender.transfer(returnAmount);                                                      // transfer ether over limit back to sender
        }
    }

    /**
     * @notice Send '_value' token to '_to' from 'msg.sender'
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return Whether the transfer was successful or not
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(tokenBalances[msg.sender] >= _value);                                               //requires token balance of 'msg.sender' to be equal or greater than '_value' to execute following code
        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(_value);                          // subtract '_value' from token balance of 'msg.sender'
        tokenBalances[_to] = tokenBalances[_to].add(_value);                                        // add '_value' to token balance of '_to'
        emit Transfer(msg.sender, _to, _value);                                                     //display transaction between 'msg.sender' and '_to'
        
        if (!isTrustee[_to]) {
            trusteeCount = trusteeCount.add(1);
            isTrustee[_to] = true;                                                                  // register recipient as new trustee
        }

        if (tokenBalances[msg.sender] == 0) {
            isTrustee[msg.sender] = false;                                                          // remove sender from trustees if balance of token equals zero
            trusteeCount = trusteeCount.sub(1);
        }

        return true;
    }

    /**
     * @notice Send '_value' token to '_to' from '_from' on the condition it is approved by '_from'
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return Whether the transfer was successful or not
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        uint256 allowance = allowed[_from][msg.sender];                                             // save value of 'allowed' on the position of '_from' and 'msg.sender'
        require(allowance >= _value, "invalid allowance");                                          // 'allowance' has to be equal or greater than '_value' to execute the following code
        require(tokenBalances[_from] >= _value, "invalid transfer amount");                         // requires token balance of '_from' to be equal or greater than 'value'

        tokenBalances[_to] = tokenBalances[_to].add(_value);                              
        tokenBalances[_from] = tokenBalances[_from].sub(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        emit Transfer(_from, _to, _value);                                                          // display transaction between '_from' and '_to'
        
        if (!isTrustee[_to]) {
            trusteeCount = trusteeCount.add(1);                                                     // register recipient as new trustee
            isTrustee[_to] = true;
        }

        if (tokenBalances[_from] == 0) {
            isTrustee[_from] = false;                                                               // remove sender from trustees if balance of token equals zero
            trusteeCount = trusteeCount.sub(1);
        }
        return true;
    }
    
    /**
     * @notice 'msg.sender' approves '_spender' to spend '_value' tokens
     * @param _spender The address of the account able to transfer the tokens
     * @param _value The amount of tokens to be approved for transfer
     * @return Whether the approval was successful or not
     */
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);                                                //display approval between 'msg.sender' and '_spender'
        return true;
    }

    /**
     * @param _owner The address of the account owning tokens
     * @param _spender The address of the account able to transfer the tokens
     * @return Amount of remaining tokens allowed to spent
     */
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    /**
     * @param _owner The address from which the balance will be retrieved
     * @return The balance
     */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return tokenBalances[_owner];
    }

    /**
     * @notice get all initialization parameters for ico contract
     */
    function getICOParameters()
        public
        view
        returns
            (uint256 icoGoal, uint256 icoEtherBalance, bool isActive, uint256 totalTokenSupply,
             uint256 icoParticipantCount, string memory tokenSymbol, uint256 tokenBalanceUser,
             uint256 etherBalanceUser, string memory icoName, uint256 numDecimals, uint256 numTrustees) {
            icoGoal = goal;
            icoEtherBalance = address(this).balance;
            isActive = isIcoActive;
            totalTokenSupply = totalSupply;
            icoParticipantCount = participants.length;
            tokenSymbol = symbol;
            tokenBalanceUser = balanceOf(msg.sender);
            etherBalanceUser = getEtherBalances();
            icoName = name;
            numDecimals = decimals;
            numTrustees = trusteeCount;
    }

    /**
     * @return Ether balance of 'msg.sender'
     */
    function getEtherBalances() public view returns(uint256) {
        return etherBalances[msg.sender];
    }

    /**
     * @notice Distribute tokenSupply between all Trustees
     */
    function distributeToken() private {                                                            // nach BA diese Funktion public machen
        for(uint256 i; i < participants.length; i++) {                                              // go trough all Trustees
            tokenBalances[participants[i]] = 
                etherBalances[participants[i]].mul(totalSupply).div(contractEtherBalance);
            emit Transfer(address(0), participants[i], tokenBalances[participants[i]]);
        }
    }

    /**
     * @notice Locks the token of '_user'
     * @param _user Address of user to lock
     */
    function lockUser(address _user) private {
        isUserLocked[_user]= true;
    }

    /**
     * @notice Unlocks token of a user
     * @param _user Address of user to unlock
     */
    function unlockUser(address _user) private {
         isUserLocked[_user]= false;
    }
}


