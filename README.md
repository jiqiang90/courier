# Blockchain-based courier system
## About
- This is a courier system prototype based on the Ethereum smart contract, and its purpose is to solve a series of problems of proof of delivery.

- The prototype simulates four different key user usage scenarios, sender, recipient, principal contractor and subcontractor. 

- The core idea is to use additional public-key cryptography on the blockchain technology to perform participant role authentication. And the public key of the recipient is transmitted in the two channels to ensure that other users cannot pretend to be the recipient to receive the package.

## Enviroment
- Please first install Ganache or similar Ethereum virtual environment.
- Get Remix IDE ready, and under DEPLOY & RUN, ENVIROMENT, select Web3 Provider, replace correct RPC server address from Ganache.
- In app.js, replace the correct RPC server address to web3 http provider address

```javascript
// replace HTTP://127.0.0.1:7545

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

}
```
- Deploy the smart contract in newcontract.sol in Remix, and don't forget assign the correct wallet address for four users first. 

```solidity
function Courier() public {
  sender = 0x136c8B1315ba061B31fd52600386B1C9803eE9cb;
  recipient = 0xEC6A6e677FeAFE4C5209C92dDbe98fD0Bd3e6756;
  principal = 0x7bb627376Ac1dDf2d9AA861bb61F37C7Ca36E99d;
  subcontractor = 0xF0eD250F4F3a000AA16Cd2C53b988A06bAF2A869;
}
```

- After deployed three contracts, copy and replace the contract address in app.js

```javascript
app.run(function($rootScope) {

    $rootScope.all_accounts= web3.eth.accounts;
    $rootScope.ShipperRecipientContractAdd = "0x7551CDd3Cfb48E496E74431E2E32F86C020a2b24";
    $rootScope.ShipperPrincipalContractAdd = "0x7b5A7304f6d6B47f6FfD02FaBA37D25a0186A4e2";
    $rootScope.TransportContractAdd = "0x88f7254a7C338F92344B53AA14EF502D9cCA1CBd";

    ....
```
- Then we good to go. Just open shipper.html, recipient.html, principal.html, subcontractor.html in your browser.


## How to simulate courier process
NOTE: Please do not try to refresh the page while in simulation, as they are not been designed to load previous data automaticlly.
And in this prototype, shipper and sender are the same. 

### Step 1
First, in the shipper interface, select the Ethereum addresses of shipper and recipient according to the address in the smart contract, and generate a pair of keys. Then split the public key, store the keypair in the smart contract.
### Step 2
Select the correct Principal account, and generate key pairs, then put it in the contract. Fill the consignment information, then click confirm to store it on Blockchain.
### Step 3
a. In the principal contractor page, with the right shipper & principal contract address, the principal contractor should be able to get the key pair. And encrypted a short passphrase such as his name, then put it back in the contract again. 
b. In shipper page, get the ciphertext from Blockchain, then decrypted it. The outcome should be identical with the principal contractor, in this way, between users can identify each others role.
### Step 4
We assumed now after identity authentication, principal contractor has collect the parcel from the sender. Then next principal contractor need to update the transprot reocrd, get the consignment tracking number from the sender, then retrive its details. Select the right status and location, record it on the blockchain.
### Step 5
Now, principal contractor can design the transport route, and assign the key pairs for the subcontractor at each stops. For example, A-B, B-C, C-D...
### Step 6
In the subcontractor page, select the correct address for subcontractor. Continue identity verification and keep update transport records, until next person need to verify is the recipient.
### Step 7
In recipient page. After identity verification between last subcontractor and recipient, recipient get the consignment from the transport record.
### Step 8
Recipient get the first half key from Sender & recipient contract, merge public key from the consignment to get the full size key. Then complete identity verification.





