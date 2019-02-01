const address = '0x594d554995db4c328d3ff2da6df9f32b4e7beb82'
const ABI = [
    {
        constant: false,
        inputs: [
            {
                name: '_proposedFee',
                type: 'uint32'
            }
        ],
        name: 'createFeeProposal',
        outputs: [
            {
                name: 'proposalID',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_fnNumber',
                type: 'uint8'
            },
            {
                name: '_memberAddress',
                type: 'address'
            },
            {
                name: '_memberName',
                type: 'string'
            }
        ],
        name: 'createMembershipProposal',
        outputs: [
            {
                name: 'proposalID',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_openProposalIndex',
                type: 'uint256'
            }
        ],
        name: 'executeProposal',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [],
        name: 'kill',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_newOwner',
                type: 'address'
            }
        ],
        name: 'transferOwnership',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: false,
        inputs: [
            {
                name: '_openProposalIndex',
                type: 'uint256'
            },
            {
                name: '_stance',
                type: 'bool'
            }
        ],
        name: 'vote',
        outputs: [
            {
                name: 'voteID',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                name: '_minQuorum',
                type: 'uint256'
            },
            {
                name: '_minsForDebate',
                type: 'uint256'
            },
            {
                name: '_majorityMargin',
                type: 'uint8'
            }
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: '_proposalID',
                type: 'uint256'
            },
            {
                indexed: false,
                name: '_description',
                type: 'string'
            }
        ],
        name: 'ProposalAdded',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: '_proposalID',
                type: 'uint256'
            },
            {
                indexed: false,
                name: '_stance',
                type: 'bool'
            },
            {
                indexed: false,
                name: '_voter',
                type: 'address'
            }
        ],
        name: 'Voted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: '_proposalID',
                type: 'uint256'
            },
            {
                indexed: false,
                name: '_positiveVotes',
                type: 'uint256'
            },
            {
                indexed: false,
                name: '_numVotes',
                type: 'uint256'
            },
            {
                indexed: false,
                name: '_executed',
                type: 'bool'
            }
        ],
        name: 'ProposalExecuted',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: '_member',
                type: 'address'
            },
            {
                indexed: false,
                name: '_isMember',
                type: 'bool'
            }
        ],
        name: 'MembershipChanged',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                name: '_oldFee',
                type: 'uint256'
            },
            {
                indexed: false,
                name: '_newFee',
                type: 'uint256'
            }
        ],
        name: 'ContractFeeChanged',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'previousOwner',
                type: 'address'
            }
        ],
        name: 'OwnershipRenounced',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'previousOwner',
                type: 'address'
            },
            {
                indexed: true,
                name: 'newOwner',
                type: 'address'
            }
        ],
        name: 'OwnershipTransferred',
        type: 'event'
    },
    {
        constant: true,
        inputs: [],
        name: 'contractFee',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'debateTime',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getMembersLength',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getOpenProposalsLength',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getProposalsLength',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'majorityMargin',
        outputs: [
            {
                name: '',
                type: 'uint8'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'address'
            }
        ],
        name: 'memberID',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        name: 'members',
        outputs: [
            {
                name: 'member',
                type: 'address'
            },
            {
                name: 'name',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'minQuorum',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        name: 'openProposals',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        name: 'proposals',
        outputs: [
            {
                name: 'author',
                type: 'address'
            },
            {
                name: 'fnNumber',
                type: 'uint8'
            },
            {
                name: 'numberOfVotes',
                type: 'uint16'
            },
            {
                name: 'positiveVotes',
                type: 'uint16'
            },
            {
                name: 'minExecutionDate',
                type: 'uint256'
            },
            {
                name: 'proposalPassed',
                type: 'bool'
            },
            {
                name: 'executed',
                type: 'bool'
            },
            {
                name: 'proposedFee',
                type: 'uint32'
            },
            {
                name: 'memberAddress',
                type: 'address'
            },
            {
                name: 'memberName',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
]
export { address, ABI }
