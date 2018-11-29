pragma solidity ^0.4.18;

contract string_utils {
    bytes1[] private _rBytes;
    /**
     * Upper
     * 
     * Converts all the values of a string to their corresponding upper case
     * value.
     * 
     * @param _base When being used for a data type this is the extended object
     *              otherwise this is the string base to convert to upper case
     * @return string in upper case
     */

    function upper(string _base) 
        internal
        pure 
        returns (string) {
        bytes memory _baseBytes = bytes(_base);
        for (uint i = 0; i < _baseBytes.length; i++) {
            _baseBytes[i] = _upper(_baseBytes[i]);
        }
        return string(_baseBytes);
    }

    /**
     * Upper
     *
     * Convert an alphabetical character to upper case and return original value when not alphabetic
     *
     * @param _b1 The byte to be converted to upper case
     * @return bytes1 The converted value if the passed value was alphabetic
     *                and in a upper case otherwise returns the original value
     */

    function _upper(bytes1 _b1)
        private
        pure
        returns (bytes1) {

        if (_b1 >= 0x61 && _b1 <= 0x7A) {
            return bytes1(uint8(_b1) - 32);
        }

        return _b1;
    }

    function removeBlanks(string _s1)
        public
        returns (string) {
            
        bytes memory _sBytes = bytes(_s1);

        for(uint256 i = 0; i < _sBytes.length; i++) {
            if(!_isBlank(_sBytes[i])) {
                _rBytes.push(_sBytes[i]);
            }
        }
        bytes memory _rString = new bytes(_rBytes.length);

        for(i = 0; i < _rString.length; i++) {
            _rString[i] = _rBytes[i];
        }

        delete _rBytes;
        _rBytes.length = 0;

        return string(_rString);
    }

    function _isBlank(bytes1 _b1) 
        private
        pure
        returns (bool) {
        
        if (_b1 == 0x20) {
            return true;
        } else {
            return false;
        }
    }

    function compareStrings(string _s1, string _s2)
        public
        returns (bool) {

        return keccak256(abi.encode(upper(removeBlanks(_s1)))) == keccak256(abi.encode(upper(removeBlanks(_s2))));
    }
}