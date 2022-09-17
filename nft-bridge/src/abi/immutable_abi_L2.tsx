export const STANDARD_ERC_BRIDGE_L2 = [
    {
        "members": [
            {
                "name": "low",
                "offset": 0,
                "type": "felt"
            },
            {
                "name": "high",
                "offset": 1,
                "type": "felt"
            }
        ],
        "name": "Uint256",
        "size": 2,
        "type": "struct"
    },
    {
        "data": [
            {
                "name": "previousOwner",
                "type": "felt"
            },
            {
                "name": "newOwner",
                "type": "felt"
            }
        ],
        "keys": [],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "name": "owner",
                "type": "felt"
            }
        ],
        "name": "constructor",
        "outputs": [],
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "get_l1_bridge",
        "outputs": [
            {
                "name": "l1_bridge",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "l2_address",
                "type": "felt"
            }
        ],
        "name": "get_l1_address",
        "outputs": [
            {
                "name": "l1_address",
                "type": "felt"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "l1_bridge_address",
                "type": "felt"
            }
        ],
        "name": "set_l1_bridge",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "l2_token_address",
                "type": "felt"
            },
            {
                "name": "l2_token_ids_len",
                "type": "felt"
            },
            {
                "name": "l2_token_ids",
                "type": "Uint256*"
            },
            {
                "name": "l1_claimant",
                "type": "felt"
            }
        ],
        "name": "initiate_withdraw",
        "outputs": [],
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "from_address",
                "type": "felt"
            },
            {
                "name": "l2_token_address",
                "type": "felt"
            },
            {
                "name": "l2_receiver_address",
                "type": "felt"
            },
            {
                "name": "l1_token_address",
                "type": "felt"
            },
            {
                "name": "l1_token_ids_len",
                "type": "felt"
            },
            {
                "name": "l1_token_ids",
                "type": "felt*"
            }
        ],
        "name": "handle_deposit",
        "outputs": [],
        "type": "l1_handler"
    }
]
