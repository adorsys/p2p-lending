//
//  File.swift
//  p2pNewLib
//
//  Created by Stefan Haßferter on 15.03.19.
//  Copyright © 2019 adorsys GmbH & Co KG. All rights reserved.
//

import Foundation

let jsonABI =
"""
[
{
"constant": false,
"inputs": [
{
"name": "to",
"type": "address"
}
],
"name": "delegate",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"constant": false,
"inputs": [
{
"name": "toVoter",
"type": "address"
}
],
"name": "giveRightToVote",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"constant": false,
"inputs": [
{
"name": "toProposal",
"type": "uint8"
}
],
"name": "vote",
"outputs": [],
"payable": false,
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [
{
"name": "_numProposals",
"type": "uint8"
}
],
"payable": false,
"stateMutability": "nonpayable",
"type": "constructor"
},
{
"constant": true,
"inputs": [],
"name": "loadProposalCount",
"outputs": [
{
"name": "_count",
"type": "uint8"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
},
{
"constant": true,
"inputs": [],
"name": "winningProposal",
"outputs": [
{
"name": "_winningProposal",
"type": "uint8"
},
{
"name": "_winningVoteCount",
"type": "uint8"
}
],
"payable": false,
"stateMutability": "view",
"type": "function"
}
]
"""
