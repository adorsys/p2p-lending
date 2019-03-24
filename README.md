[![Build Status](https://travis-ci.org/adorsys/p2p-lending.svg?branch=master)](https://travis-ci.org/adorsys/p2p-lending)

# P2P-Lending

## Table of Contents

- [About the Project](#about-the-project)
  - [Challenges](#challenges)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

<!-- ABOUT THE PROJECT -->

## About The Project

This repository hosts a variety of smart contracts for a DAO (Decentralized Autonomous Organisation) focussing on delivering a decentralized p2p-lending platform on the Ethereum Blockchain. This may very well develop into something completely different based on the direction taken by the DAO in the future. We are as excited as you are! ;-)

_A decentralized, smart contract based platform for p2p-lending on the Ethereum Blockchain can play the role of a bank in the process of lending money to one or more beneficiaries.
The open ecosystem of the p2p-lending platform has the potential to offer cheaper lending contracts than traditional centralized institutions, while also enabling people all over the world to profit from a fair and transparent portfolio of products._

### Challenges

To solve multiple challenges within such a substantial system, we are conductiong extensive research into Ethereum and other potential smart contract platforms as well as continue developing a modular system based on components solving those challenges one by one. The most pressing challenges to solve for such a system include:

- Proof of Identity
- Decentralized management and progression of the ecosystem by a DAO
- Staying within the bounds of Ethereum
- Incentivization of the DAO ecosystem and its continuous use
- Building financially profitable and inclusive products
- Accessibility and Usability of the p2p-lending plattform and ecosystem

### Built With

- [Node 10](https://nodejs.org/en/)
- [Truffle](https://truffleframework.com/truffle)
- [Vue.js](https://vuejs.org/)
- [web3.js](https://web3js.readthedocs.io/en/1.0/getting-started.html)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

These are the requisites you need, in order to use the software and instructions, on how to install them.

- [Node.js](https://nodejs.org/en/):

  - macOS:
    - Install [Homebrew](https://brew.sh/):
      ```sh
      /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
      ```
    - Update Homebrew:
      ```sh
      brew update
      ```
    - Check if Homebrew is ready to brew:
      ```sh
      brew doctor
      ```
    - Install Node.js:
      ```sh
      brew install node
      ```
    - Test that Node.js was installed by running:
      ```sh
      node --version
      ```
  - Windows:
    - Install [Chocolatey](https://chocolatey.org/install):
      - via cmd.exe:
        ```sh
        @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
        ```
      - via PowerShell.exe:
        ```sh
        Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
        ```
    - Install Node.js:
      ```sh
      choco install nodejs
      ```
    - Test that Node.js was installed by running:
      ```sh
      node --version
      ```

- [npm](https://www.npmjs.com/)

  - Install npm:

    ```sh
    npm install npm -g
    ```

  - Test that npm was installed by running:

    ```sh
    npm --version
    ```

- [Ganache](https://truffleframework.com/ganache)
- [Truffle](https://truffleframework.com/truffle)
  - Install Truffle:
    ```sh
    npm install truffle -g
    ```
  - Test that truffle was installed by running:
    ```sh
    truffle version
    ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/adorsys/p2p-lending.git
   ```

2. Run Ganache on port 8545

   ```sh
   Ganache -> Settings -> Server -> Port Number -> 8545
   ```

3. Install dependencies

   ```sh
   npm install
   ```

4. Compile Smart Contracts

   ```sh
   truffle compile
   ```

5. Deploy Smart Contracts to local blockchain

   ```sh
   npm run migrate:dev
   ```

6. Switch to frontend folder

   ```sh
   cd frontend
   ```

7. Install frontend dependencies

   ```sh
   npm install
   ```

8. Start frontend

   ```sh
   npm start
   ```

9. Open the DApp in your favorite browser

   ```sh
   localhost:8080
   ```
