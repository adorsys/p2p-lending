//
//  ViewController.swift
//  p2pLending
//
//  Created by Stefan Haßferter on 22.02.19.
//  Copyright © 2019 adorsys GmbH & Co KG. All rights reserved.
//

import UIKit
import Web3Swift

class ViewController: UIViewController {
    @IBOutlet weak var SyncFunds: UIButton!
    @IBOutlet weak var fundLabel: UILabel!
    @IBOutlet weak var fundInput: UITextField!
    @IBOutlet weak var transactionButton: UIButton!
    
    var sender:PrivateKey!
    var recipient: BytesScalar!
    var network:Network!
    var amount:BytesScalar!
    @IBOutlet weak var imageView: UIImageView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        sender = EthPrivateKey(hex: "0xb7553adc227436ddd9a41fa114f2248cc6247f80276726c3450b93861866d8b0")
        recipient = EthAddress(hex: "0xbF19938BcfcD4b09684987e4C464D995C5A365de")
        
        network = GethNetwork(url: "HTTP://172.16.121.109:7545")
        
        amount = EthNumber(hex: "0xde0b6b3a7640000")
        
      
        
        // Do any additional setup after loading the view, typically from a nib.
    }
    
    @IBAction func syncFundsPressed(_ sender: Any) {
        let balance = try HexAsDecimalString(hex: EthBalance(network: network,
                                                             address: EthAddress(hex: "0xbF19938BcfcD4b09684987e4C464D995C5A365de")))
        fundLabel.text = try? balance.value()
        
    }
    
    @IBAction func transactionButtonPressed(_ sender: Any) {
        
        let response = try? SendRawTransactionProcedure(network: network, transactionBytes: EthDirectTransactionBytes(
            network: network,
            senderKey: self.sender,
            recipientAddress: recipient,
            weiAmount: amount
        )).call()
        
        print(response!["result"].string ?? "Something went wrong")
    }
}

