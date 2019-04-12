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

    @IBOutlet weak var tableview: UITableView!
    @IBOutlet weak var winning: UILabel!

    var numberOfProposals = 0

    //ganache first
    let privateKey = try! EthereumPrivateKey(hexPrivateKey:"0xb7553adc227436ddd9a41fa114f2248cc6247f80276726c3450b93861866d8b0")
    let etherNode = Web3( rpcURL: "http://192.168.178.148:8545")


    var contractAddress = EthereumAddress(hexString: "0x24aa30159759ee23421aa808c5d50998736d346e")
    var contract: DynamicContract?

    override func viewDidLoad() {
        super.viewDidLoad()

        etherNode.clientVersion { (Web3Response) in
            print(Web3Response)
        }

        tableview.dataSource = self
        tableview.delegate = self

        if let contractAddress = extractContractAdress(from: "Abi"){
        contract = createContract(from: "Abi",at: contractAddress)
        }

        guard let contract = contract else {return}

//        let loadPropsalCount = contract["loadProposalCount"]!().createCall()
//        contract.call(loadPropsalCount!, outputs: [.init(name: "_count", type: .uint8)]) { (response, error) in
//            if let response = response,
//                let item = response["_count"] as? UInt8
//            {
//                self.numberOfProposals = Int(item)
//                DispatchQueue.main.async {
//                    self.tableview.reloadData()
//                    self.showWinning()
//                }
//
//            }
//
//        }
    }
}

extension ViewController{

    func createContract(from abi:String,at address:EthereumAddress) -> DynamicContract?{

        guard let jsonAbi = loadAbi(from: abi) else {return nil}

        let containerObject = try? JSONSerialization.jsonObject(with: jsonAbi, options: []) as? [String: Any]

        if let pureAbiJSON = ((containerObject??["contracts"] as? [String: Any])?["requestManagement"] as? [String: Any]){
        let jsonData = (try? JSONSerialization.data(withJSONObject: pureAbiJSON)) ?? Data()
            let contract = try? etherNode.eth.Contract(json: jsonData, abiKey: "abi", address: address)
            return contract
        }
        return nil
    }


    func extractContractAdress(from abi:String) -> EthereumAddress?{
        guard let jsonAbi = loadAbi(from: abi) else {return nil}

        let containerObject = try? JSONSerialization.jsonObject(with: jsonAbi, options: []) as? [String: Any]

        if let pureAbiJSON = ((containerObject??["contracts"] as? [String: Any])?["requestManagement"] as? [String: Any])?["address"] as? String{
            return EthereumAddress(hexString: pureAbiJSON)
        }
        return nil
    }

    func loadAbi(from path:String)->Data?{
        if let path = Bundle.main.path(forResource: path, ofType: "json"),
            let data = try? Data(contentsOf: URL(fileURLWithPath: path)) {
            return data
        }
        return nil
    }

    func showWinning(){
        guard let contract = contract else {return}

        let winningProposal = contract["winningProposal"]!().createCall()
        contract.call(winningProposal!, outputs: [.init(name: "_winningProposal", type: .uint8),
                                                  .init(name: "_winningVoteCount", type: .uint8)]) { (response, error) in
                                                    if let response = response{
                                                    DispatchQueue.main.async {
                                                        self.winning.text = "Proposal #\(String(describing: response["_winningProposal"]!)) with \(response["_winningVoteCount"]!) votes"
                                                        }
                                                    }
        }
    }
}


extension ViewController:UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return numberOfProposals
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableview.dequeueReusableCell(withIdentifier: "proposalCell")!
        cell.textLabel?.text = "Proposal #\(indexPath.row)"
        return cell
    }
}

extension ViewController:UITableViewDelegate{

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard let contract = contract else {return}

        let c = contract["vote"]?(BigUInt(indexPath.row))

        etherNode.eth.getTransactionCount(address: privateKey.address, block: .latest){ response in
            print (response.result!.quantity)

            let trans = c!.createTransaction(nonce: response.result!,
                                             from: self.privateKey.address,
                                             value: 0,
                                             gas: 643074,
                                             gasPrice: EthereumQuantity(quantity: 1.gwei))

            
            let signedTx = try! trans?.sign(with: self.privateKey,chainId: 5777)

            self.etherNode.eth.sendRawTransaction(transaction: signedTx!) { response in
                print(response)
                self.showWinning()
            }
        }
    }
}

