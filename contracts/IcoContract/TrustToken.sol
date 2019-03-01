/*
Implements EIP20 token standard: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
.*/
pragma solidity ^0.5.0;
import "./EIP20Interface.sol";
//import "./LendingBoard.sol"; //interface statt import

//interface LendingBoard{
//  funtion vote(uint256, bool) public returns(uint256);
//}

contract TrustToken is EIP20Interface {

    //address LendingBoard_add = 0x692a70D2e424a56D2C6C27aA97D1a86395877b3A;
    //LendingBoard LB = LendingBoard(LendingBoard_add);
    //mapping (address => bool) public isUserLocked;

    uint256 public totalSupply;

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) private tokenBalances;
    mapping (address => uint256) public etherBalances;
    mapping (address => mapping (address => uint256)) public allowed;
    address[] public participants;
    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //name: eg TrustToken
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg TT

    uint public goal = 10 ether;
    uint public contractEtherBalance = 0 ether;
    bool public isIcoActive= true;
    uint public price = 0 ether;

    uint storeDate;

    constructor(
        /*uint256 _initialAmount,
        string memory _tokenName,
        uint8 _decimalUnits,
        string memory _tokenSymbol
        */
    ) public {
        //tokenBalances[msg.sender] = 1000;               // Give the creator all initial tokens
        name = "TrustToken";                                   // Set the name for display purposes
        decimals = 18;                                // Amount of decimals for display purposes
        symbol = "TT";                               // Set the symbol for display purposes
        totalSupply = 100 * (10 ** uint(decimals));  // Update total supply

    }

     //-------------------------------------------------
    function set(uint x) public {
        storeDate = x;
        
    }
    function get() public view returns (uint) {
        return storeDate;
    }
    
    //-------------------------------------------------
    
    
   /* modifier userIsNotLocked(address user) {
        require(userIsNotLocked[user]==false);
        _;
    }
    modifier calledByLB(address add)
    {
         require(add == LendingBoard_add);
        _;
    }

    function vote(uint256 _openProposalIndex, bool _stance) public userIsNotLocked(msg.sender)
    {
        lockUser(msg.sender);
        LB.vote(_openProposalIndex, _stance, msg.sender);
    }

    function lockUser(address user) private
    {
        isUserLocked[user]= true;
    }

    function unlockUser(address user) private
    {
         isUserLocked[user]= false;
    }

    function unlockUsers(address [] memory users) public calledByLB(msg.sender)
    {
        for(uint i; i < users.length; i++)
        {
            unlockUser(users[i]);
        }

    }
    
    */

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(tokenBalances[msg.sender] >= _value);
        tokenBalances[msg.sender] -= _value;
        tokenBalances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public //user_is_not_locked(_from)
    returns (bool success)
    {
        uint256 allowance = allowed[_from][msg.sender];
        require(tokenBalances[_from] >= _value && allowance >= _value);
        tokenBalances[_to] += _value;
        tokenBalances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return tokenBalances[_owner];
    }
    
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function participate () external payable{
        
        if(isIcoActive)
        {
            etherBalances[msg.sender] += msg.value; //add to senders ether_balance
            contractEtherBalance += msg.value; // add to contract_balance
            
            for(uint i = 0; i < participants.length; i++) // go trough all participants
            {
                if(participants[i] == msg.sender){ //break the for-loop if msg.sender already participant
                    break;
                }
            
                if(i == participants.length-1 ){ // if msg.sender made it to the last participant he will be put into array
                    participants.push(msg.sender);
                }
            }
            
            if( participants.length==0) //the very first participant will be add to the participants array
            {
                participants.push(msg.sender);
            }
        }
        
        
        if(contractEtherBalance >= goal && isIcoActive) // if goal was reached and ico is still active, then distrube token to all participants
        {    
            distributeToken(); //distribute all tokens to all participants
            isIcoActive = false; //ico not active nomore
        }
        

    }
  
    function distributeToken() private 
    {
        for(uint i = 0; i < participants.length; i++)
        {
            tokenBalances[ participants[i] ] =(  (etherBalances[ participants[i] ]) * totalSupply ) / contractEtherBalance;//Token = (Ether/contractEtherBalance) * totalSupply
            emit Transfer( 0x0000000000000000000000000000000000000000, participants[i], tokenBalances[ participants[i] ]);
        }
        

    }
    
    function getParticipantsCount() public view returns(uint)
    {
        return(participants.length);
    }

    function payFees () external payable
    {
        contractEtherBalance += msg.value;
    } 


    function getEtherBalances() public view returns(uint)
    {
        return (etherBalances[msg.sender]);
    }
   
}
