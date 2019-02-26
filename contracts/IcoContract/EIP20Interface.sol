// Interface Contract für den ERC20-Token-Standard
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md
pragma solidity ^0.5.0; //Solidity-Compiler Version


contract EIP20Interface {

    /// gesamte Menge der Token
    uint256 public totalSupply;

    /// @param _owner Die Adresse von welcher das Tokenguthaben abgefragt wird
    /// @return Das Tokenguthaben
    function balanceOf(address _owner) public view returns (uint256 balance);

    /// @notice Verschicke die Menge '_value' an Token an '_to' vom 'msg.sender'
    /// @param _to Die Adresse des Empfängers
    /// @param _value Die Menge an Token, welche versendet werden
    /// @return Rückgabewert bezeugt den Erfolg der Transaktion
    function transfer(address _to, uint256 _value) public returns (bool success);

    /// @notice Verschicke die Menge '_value' an Token an to '_to' vom '_from' unter der Bedingung, '_from' akzeptiert dies
    /// @param _from Die Adresse des Absenders
    /// @param _to Die Adresse des Empfängers
    /// @param _value Die Menge an Token, welche versendet werden
    /// @return Rückgabewert bezeugt den Erfolg der Transaktion
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);

    /// @notice 'msg.sender' akzeptiert, dass '_spender' die Menge '_value' an Token versedet
    /// @param _spender Die Adresse des Kontos, welches die Transaktion tätigen darf
    /// @param _value Die Menge an Token, welche versendet werden dürfen
    /// @return Rückgabewert bezeugt den das Einverständnis von 'msg.sender' 
    function approve(address _spender, uint256 _value) public returns (bool success);

    /// @param _owner Die Adresse des Kontos, welches die Token besitzt
    /// @param _spender Die Adresse des Kontos, welches die Transaktion tätigen darf
    /// @return Die Menge an restlichen Token, welche transferiert werden dürfen
    function allowance(address _owner, address _spender) public view returns (uint256 remaining);

    // Events protokollieren die Transaktionen und Einverständniserklärungen 
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}
