//
//  ViewController.swift
//  p2pNewLib
//
//  Created by Stefan Haßferter on 15.03.19.
//  Copyright © 2019 adorsys GmbH & Co KG. All rights reserved.
//

import UIKit
import Web3


class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        let etherNode = Web3( rpcURL: "http://172.16.121.109:8545")

       etherNode.clientVersion { (Web3Response) in
        print(Web3Response)
        }

        let contractAddress = EthereumAddress(hexString: "0x24aA30159759eE23421AA808c5d50998736D346e")


        let contract = try! etherNode.eth.Contract(json: jsonABI.data(using: .utf8)!, abiKey: nil, address: contractAddress)

        let test = contract["loadProposalCount"]!().call { (response, error) in
            let test2 = 0
            if let response = response,
                let count = response["_count"]{
                print(count)
            }
        }

        print(test)
    }
}

