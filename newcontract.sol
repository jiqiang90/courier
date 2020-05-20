pragma solidity ^0.4.18;

contract Courier {
    
    address sender;
    address recipient;
    address principal;
    address subcontractor;
    
    function Courier() public {
       sender = 0x136c8B1315ba061B31fd52600386B1C9803eE9cb;
       recipient = 0xEC6A6e677FeAFE4C5209C92dDbe98fD0Bd3e6756;
       principal = 0x7bb627376Ac1dDf2d9AA861bb61F37C7Ca36E99d;
       subcontractor = 0xF0eD250F4F3a000AA16Cd2C53b988A06bAF2A869;
    }
    
   modifier onlySender {
       require(msg.sender == sender);
       _;
   }
   
    modifier onlyRecipient {
       require(msg.sender == recipient);
       _;
   }
   
    modifier onlyPrincipal {
       require(msg.sender == principal);
       _;
   }
   
   
      
    modifier onlySender_Principal {
       require(msg.sender == sender || msg.sender == principal);
       _;
   }
   
   
    modifier onlyPrincipal_Subcontractor(){
        require(msg.sender == principal || msg.sender == subcontractor);
        _;
    }
   
    modifier onlyPrincipal_Subcontractor_Recipient(){
        require(msg.sender == principal || msg.sender == subcontractor || msg.sender == recipient);
        _;
    }
   
}


contract SenderRecipient is Courier {
    
    struct KeyPair{
        address sender;
        address receiver;
        string privKey;
        string pubKey;
    }
    
    struct Ciphertext{
        string iv;
        string ephemPublicKey;
        string ciphertext;
        string mac;
    }
    
    
    mapping (address => Ciphertext) ciphertexts;
    address[] public CiphertextList;
    
    mapping (address => KeyPair) keyPairs;
    address[] public KeyPairList;
    
    
    function setKeyPair(address _keyAddress, address _sender, address _receiver, string _privKey, string _pubKey) onlySender public { 

            var keyPair = keyPairs[_keyAddress];  //receiver address as the key address
            keyPair.sender = _sender;
            keyPair.receiver = _receiver;
            keyPair.privKey = _privKey;
            keyPair.pubKey = _pubKey;
            KeyPairList.push(_keyAddress) -1; //push to array
            

    }

    function getKeyPair(address ins) view public returns (address,address, string,string) {   // only sender and receiver can view their key pair
        if(sender== msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,keyPairs[ins].privKey,keyPairs[ins].pubKey);
        }else if (recipient==msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,'NO PRIVATE KEY TO SHOW',keyPairs[ins].pubKey);
        }
    }
    
    
    function getKeyPairs() onlySender view public returns (address[]) {  //get all value in keyPairs
        return KeyPairList; 
    }
    

    function pushCiphertext (address _keyAddress, string _iv, string _ephemPublicKey, string _ciphertext, string _mac ) onlyRecipient public { //only encrypt party can set Ciphertext
        
            var ciphertext = ciphertexts[_keyAddress];  //create key in array
            ciphertext.iv = _iv;
            ciphertext.ephemPublicKey = _ephemPublicKey;
            ciphertext.ciphertext = _ciphertext;
            ciphertext.mac = _mac;
            CiphertextList.push(_keyAddress) -1; //push to array
    }


    function getCiphertext(address keyAddress) onlySender view public returns (string,string,string,string) {   //only decrypt party can retrive ciphertext
        return (  
            ciphertexts[keyAddress].iv,
            ciphertexts[keyAddress].ephemPublicKey, 
            ciphertexts[keyAddress].ciphertext,
            ciphertexts[keyAddress].mac
            );
    }

}

contract SenderPrincipal is Courier {
    
    struct KeyPair{
        address sender;
        address receiver;
        string privKey;
        string pubKey;
    }

    struct Consignment {
        address shipper;
        string shipperInfo;
        address recipient;
        string recipientPartialKey;
        string recipientInfo;
        string itemInfo;
        uint shippingCost;
        address keyPairAddress;
        address principal;
    }
    
    struct Ciphertext{
        string iv;
        string ephemPublicKey;
        string ciphertext;
        string mac;
    }
    
    
    
    mapping (address => Ciphertext) ciphertexts;
    address[] public CiphertextList;
    
    mapping (address => KeyPair) keyPairs;
    address[] public KeyPairList;
    
    mapping (string => Consignment) consignments;
    string[] public ConsignmentList;
    
    event KeyPairInfo(
        address contractAddress,
        address sender,
        address receiver,
        string privKey,
        string pubKey
    );
    

    function setKeyPair(address _keyAddress, address _sender, address _receiver, string _privKey, string _pubKey) onlySender public { 
        
            var keyPair = keyPairs[_keyAddress];  //receiver address as the key address
            keyPair.sender = _sender;
            keyPair.receiver = _receiver;
            keyPair.privKey = _privKey;
            keyPair.pubKey = _pubKey;
            KeyPairList.push(_keyAddress) -1; //push to array
            
            KeyPairInfo(_keyAddress,  _sender,  _receiver, _privKey, _pubKey); //watch event
      
    }

    function getKeyPair(address ins) view public returns (address,address, string,string) {   // only sender and receiver can view their key pair
        if( sender == msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,keyPairs[ins].privKey,keyPairs[ins].pubKey);
        }else if ( principal ==msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,'NO PRIVATE KEY TO SHOW',keyPairs[ins].pubKey);
        }
    }
    
    
    function getKeyPairs() view public returns (address[]) {  //get all value in keyPairs
        return KeyPairList; 
    }
    
    function setConsignment(address _shipper,string _shipperInfo,address _recipient,string _recipientPartialKey, string _recipientInfo, string _itemInfo, uint _cost, address _principal,address _keyPairAddress, string _trackingNum) onlySender public { 
        var consignment = consignments[_trackingNum];
        
        consignment.shipper = _shipper;
        consignment.shipperInfo = _shipperInfo;


        consignment.recipient = _recipient;
        consignment.recipientPartialKey = _recipientPartialKey;
        consignment.recipientInfo = _recipientInfo;

        consignment.itemInfo = _itemInfo;

        consignment.shippingCost = _cost;
        consignment.keyPairAddress = _keyPairAddress;
        consignment.principal = _principal;

        ConsignmentList.push(_trackingNum) -1; //push to array
    }
 
    function getConsignment(string track) onlySender_Principal view public returns (string,address,string,string,string,uint,address,string) {   
        return (
            //consignments[track].shipper,
            consignments[track].shipperInfo, 
            consignments[track].recipient,
            consignments[track].recipientPartialKey,

            consignments[track].recipientInfo,
            consignments[track].itemInfo,
            consignments[track].shippingCost, 
            consignments[track].principal,
            
            track
            );
    }
    
    function pushCiphertext (address _keyAddress, string _iv, string _ephemPublicKey, string _ciphertext, string _mac ) onlyPrincipal public { //only encrypt party can set Ciphertext
        
            var ciphertext = ciphertexts[_keyAddress];  //create key in array
            ciphertext.iv = _iv;
            ciphertext.ephemPublicKey = _ephemPublicKey;
            ciphertext.ciphertext = _ciphertext;
            ciphertext.mac = _mac;
            CiphertextList.push(_keyAddress) -1; //push to array
    }

    function getCiphertext(address keyAddress) view onlySender public returns (string,string,string,string) {   //only decrypt party can retrive ciphertext
        return (  
            ciphertexts[keyAddress].iv,
            ciphertexts[keyAddress].ephemPublicKey, 
            ciphertexts[keyAddress].ciphertext,
            ciphertexts[keyAddress].mac
            );
    }
    

   
}

contract Transport is Courier {
    
    struct KeyPair{
        address sender;
        address receiver;
        string privKey;
        string pubKey;
    }
    
    struct TransportRecord{
        string consignment;
        address contractAddress;
        bytes32 time;
        string status;
        string location;
        address recipient;
        address contractor;
    }
    
    struct Ciphertext{
        string iv;
        string ephemPublicKey;
        string ciphertext;
        string mac;
    }
    
    
    
    mapping (address => Ciphertext) ciphertexts;
    address[] public CiphertextList;
    
    mapping (address => KeyPair) keyPairs;
    address[] public KeyPairList;
    
    mapping (bytes32 => TransportRecord) transportRecords;
    bytes32[] public transportRecordList;


    event KeyPairInfo(
        address contractAddress,
        address sender,
        address receiver,
        string privKey,
        string pubKey
    );
    

  
    
    function setKeyPair(address _keyAddress, address _sender, address _receiver, string _privKey, string _pubKey) onlyPrincipal public { 
        
            var keyPair = keyPairs[_keyAddress];  //receiver address as the key address
            keyPair.sender = _sender;
            keyPair.receiver = _receiver;
            keyPair.privKey = _privKey;
            keyPair.pubKey = _pubKey;
            KeyPairList.push(_keyAddress) -1; //push to array
            
            KeyPairInfo(_keyAddress,  _sender,  _receiver, _privKey, _pubKey); //watch event
      
    }

    function getKeyPair(address ins)  onlyPrincipal_Subcontractor_Recipient view public returns (address,address, string,string) {   // only sender and receiver can view their key pair
        if(keyPairs[ins].sender==msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,keyPairs[ins].privKey,keyPairs[ins].pubKey);
        }else if (keyPairs[ins].receiver==msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,'NO PRIVATE KEY TO SHOW',keyPairs[ins].pubKey);
        }
    }
    
    
    function getKeyPairs() view public returns (address[]) {  //get all value in keyPairs
        return KeyPairList; 
    }
    
    
    
    function pushCiphertext (address _keyAddress, string _iv, string _ephemPublicKey, string _ciphertext, string _mac )  onlyPrincipal_Subcontractor_Recipient public { //only encrypt party can set Ciphertext
        
            var ciphertext = ciphertexts[_keyAddress];  //create key in array
            ciphertext.iv = _iv;
            ciphertext.ephemPublicKey = _ephemPublicKey;
            ciphertext.ciphertext = _ciphertext;
            ciphertext.mac = _mac;
            CiphertextList.push(_keyAddress) -1; //push to array
    }



    function getCiphertext(address keyAddress) view onlyPrincipal_Subcontractor public returns (string,string,string,string) {   //only decrypt party can retrive ciphertext
        return (  
            ciphertexts[keyAddress].iv,
            ciphertexts[keyAddress].ephemPublicKey, 
            ciphertexts[keyAddress].ciphertext,
            ciphertexts[keyAddress].mac
            );
    }
    
    
    function setTransportRecord(address _contractor, string _consignment, bytes32 _time, string _status, string _location, address _recipient) onlyPrincipal_Subcontractor public { 
        
            var transportRecord = transportRecords[_time];  //create key in array
            transportRecord.consignment = _consignment;
            transportRecord.contractor = _contractor;
            //transportRecord.time = _time;
            transportRecord.status = _status;
            transportRecord.location = _location;
            transportRecord.recipient = _recipient;
            transportRecordList.push(_time) -1; //push to array
            
    }
    
    function getTransportRecord(bytes32 _time) view onlyPrincipal_Subcontractor_Recipient public returns (string,bytes32,address,string,string,address) { 
        

            return(
                transportRecords[_time].consignment,
                transportRecords[_time].time,
                transportRecords[_time].contractor,
                transportRecords[_time].status,
                transportRecords[_time].location,
                transportRecords[_time].recipient

               );
            
    }
    function getTransportRecords() view onlyPrincipal_Subcontractor_Recipient public returns (bytes32 []) {  
        
        return transportRecordList; 
    }
    
    

   
}

