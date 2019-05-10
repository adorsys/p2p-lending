/**
 * Directory: P2P-Lending/contracts/IcoContract/TrustToken.sol
 * Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
 */
pragma solidity ^0.5.0;                                                                             // Solidity compiler version
import "./EIP20Interface.sol";
import "../SafeMath.sol";

contract TrustToken is EIP20Interface {
    using SafeMath for uint256;

    modifier calledByProposalManagement {
        require(msg.sender == proposalManagement, "invalid caller");
        _;
    }

    mapping (address => bool) public isUserLocked;                              // are token of address locked
    mapping (address => uint256) private tokenBalances;                         // token balance of trustees
    mapping (address => uint256) public etherBalances;                          // invested ether of trustees
    mapping (address => mapping (address => uint256)) public allowed;           // register of all permissions form one user to another
    mapping (address => bool) public isTrustee;

    address public proposalManagement;
    address[] public participants;
    string public name;
    string public symbol;
    uint256 public totalSupply;
    uint256 public trusteeCount;
    uint256 public goal = 10 ether;
    uint256 public contractEtherBalance;
    uint8 public decimals;
    bool public isIcoActive;

    /// Display transactions and approvals
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    /// Track Participation & ICO Status
    event Participated();
    event ICOFinished();

    constructor(
        uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
    ) public {
        name = _tokenName;
        decimals = _decimalUnits;
        symbol = _tokenSymbol;
        totalSupply = _initialAmount.mul(10 ** uint256(decimals));
        isIcoActive = true;
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
     * @notice Locks the token of '_user'
     * @param _user Address of user to lock
     */
    function lockUser(address _user) external calledByProposalManagement returns(bool) {
        isUserLocked[_user] = true;
        return isUserLocked[_user];
    }

    /**
     * @notice Unlocks token of a list of users
     * @param _users List of users to unlock
     */
    function unlockUsers(address[] calldata _users) external calledByProposalManagement {
        for(uint256 i; i < _users.length; i++) {
            isUserLocked[_users[i]] = false;
        }
    }

    /**
     * @notice Invest Ether to become a Trustee and get token when ICO finishes
     */
    function participate () external payable {
        require(isIcoActive, "ICO inactive");

        uint256 allowedToAdd = msg.value;
        uint256 returnAmount;

        if( (contractEtherBalance.add(msg.value)) > goal) {                     // update allowedToAdd when goal is reached
            allowedToAdd = goal.sub(contractEtherBalance);
            returnAmount = msg.value.sub(allowedToAdd);                         // save the amount of ether that is to be returned afterwards
        }

        etherBalances[msg.sender] = etherBalances[msg.sender].add(allowedToAdd);
        contractEtherBalance = contractEtherBalance.add(allowedToAdd);

        if(!isTrustee[msg.sender]) {
            participants.push(msg.sender);                                      // add msg.sender to participants
            isTrustee[msg.sender] = true;
        }

        emit Participated();

        if(contractEtherBalance >= goal) {                                      // distribute token after goal was reached
            isIcoActive = false;
            trusteeCount = participants.length;
            distributeToken();
            emit ICOFinished();
        }

        if (returnAmount > 0) {
            msg.sender.transfer(returnAmount);                                  // transfer ether over limit back to sender
        }
    }

    /**
     * @notice Send '_value' token to '_to' from 'msg.sender'
     * @param _to The address of the recipient
     * @param _value The amount of token to be transferred
     * @return Whether the transfer was successful or not
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(tokenBalances[msg.sender] >= _value, "insufficient funds");

        tokenBalances[msg.sender] = tokenBalances[msg.sender].sub(_value);
        tokenBalances[_to] = tokenBalances[_to].add(_value);

        emit Transfer(msg.sender, _to, _value);

        if (!isTrustee[_to]) {
            trusteeCount = trusteeCount.add(1);
            isTrustee[_to] = true;                                              // register recipient as new trustee
        }

        if (tokenBalances[msg.sender] == 0) {
            isTrustee[msg.sender] = false;                                      // remove sender from trustees if balance of token equals zero
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
        uint256 allowance = allowed[_from][msg.sender];
        require(allowance >= _value, "insufficient allowance");
        require(tokenBalances[_from] >= _value, "invalid transfer amount");

        tokenBalances[_to] = tokenBalances[_to].add(_value);
        tokenBalances[_from] = tokenBalances[_from].sub(_value);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);

        emit Transfer(_from, _to, _value);

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
        require(balanceOf(msg.sender) >= _value, "insufficient funds");
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
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
             uint256 etherBalanceUser, string memory icoName, uint256 numDecimals, uint256 numTrustees)
    {
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
    function distributeToken() private {
        for(uint256 i; i < participants.length; i++) {
            tokenBalances[participants[i]] = (etherBalances[participants[i]].mul(totalSupply)).div(contractEtherBalance);
            emit Transfer(address(this), participants[i], tokenBalances[participants[i]]);
        }
    }
}


