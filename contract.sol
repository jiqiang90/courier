pragma solidity ^0.4.18;

contract Courier  {
    
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
    
    struct Consignment {
        address shipper;
        string shipperInfo;
        address recipient;
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
    
    mapping (bytes32 => TransportRecord) transportRecords;
    bytes32[] public transportRecordList;

    mapping (string => Consignment) consignments;
    string[] public ConsignmentList;
    
    event KeyPairInfo(
        address contractAddress,
        address sender,
        address receiver,
        string privKey,
        string pubKey
    );
    

    
    
    function setKeyPair(address _contractAddress, address _sender, address _receiver, string _privKey, string _pubKey) public { 
        
        if(_sender == msg.sender){ // only sender can set key pair
            var keyPair = keyPairs[_contractAddress];  //create key in array
            keyPair.sender = _sender;
            keyPair.receiver = _receiver;
            keyPair.privKey = _privKey;
            keyPair.pubKey = _pubKey;
            KeyPairList.push(_contractAddress) -1; //push to array
            
            KeyPairInfo(_contractAddress,  _sender,  _receiver, _privKey, _pubKey); //watch event
        }
    }

    function getKeyPair(address ins) view public returns (address,address, string,string) {   // only sender and receiver can view their key pair
        if(keyPairs[ins].sender==msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,keyPairs[ins].privKey,keyPairs[ins].pubKey);
        }else if (keyPairs[ins].receiver==msg.sender){
            return (keyPairs[ins].sender, keyPairs[ins].receiver,'NO PRIVATE KEY TO SHOW',keyPairs[ins].pubKey);
        }
    }
    
    
    function getKeyPairs() view public returns (address[]) {  //get all value in keyPairs
        return KeyPairList; 
    }
    
    

    
    function setConsignment(address _shipper,string _shipperInfo,address _recipient,string _recipientInfo, string _itemInfo, uint _cost, address _principal,address _keyPairAddress, string _trackingNum) public { 
        
        var consignment = consignments[_trackingNum];
        
        consignment.shipper = _shipper;
        consignment.shipperInfo = _shipperInfo;


        consignment.recipient = _recipient;
        consignment.recipientInfo = _recipientInfo;

        consignment.itemInfo = _itemInfo;

        consignment.shippingCost = _cost;
        consignment.keyPairAddress = _keyPairAddress;
        consignment.principal = _principal;

        ConsignmentList.push(_trackingNum) -1; //push to array
    }
 
    function getConsignment(string track) view public returns (address,string,address,string,string,uint,address,string) {   
        return (
            consignments[track].shipper,
            consignments[track].shipperInfo, 
            consignments[track].recipient,
            consignments[track].recipientInfo,
            consignments[track].itemInfo,
            consignments[track].shippingCost, 
            consignments[track].principal,

            track
            );
    }
    
    /*
    function getConsignments() view public returns (string[]) {  
        return ConsignmentList; 
    }
    */
    
    function pushCiphertext (address _keyAddress, string _iv, string _ephemPublicKey, string _ciphertext, string _mac ) public { //only encrypt party can set Ciphertext
        
            var ciphertext = ciphertexts[_keyAddress];  //create key in array
            ciphertext.iv = _iv;
            ciphertext.ephemPublicKey = _ephemPublicKey;
            ciphertext.ciphertext = _ciphertext;
            ciphertext.mac = _mac;
            CiphertextList.push(_keyAddress) -1; //push to array
    }



    function getCiphertext(address keyAddress) view public returns (string,string,string,string) {   //only decrypt party can retrive ciphertext
        return (  
            ciphertexts[keyAddress].iv,
            ciphertexts[keyAddress].ephemPublicKey, 
            ciphertexts[keyAddress].ciphertext,
            ciphertexts[keyAddress].mac
            );
    }
    
    
    function setTransportRecord(address _contractor, string _consignment, bytes32 _time, string _status, string _location, address _recipient) public { 
        
            var transportRecord = transportRecords[_time];  //create key in array
            transportRecord.consignment = _consignment;
            transportRecord.contractor = _contractor;
            //transportRecord.time = _time;
            transportRecord.status = _status;
            transportRecord.location = _location;
            transportRecord.recipient = _recipient;
            transportRecordList.push(_time) -1; //push to array
            
    }
    
    function getTransportRecord(bytes32 _time) view public returns (string,bytes32,address,string,string) { 
        

            return(
                transportRecords[_time].consignment,
                transportRecords[_time].time,
                transportRecords[_time].contractor,
                transportRecords[_time].status,
                transportRecords[_time].location
               );
            
    }
    function getTransportRecords() view public returns (bytes32 []) {  
        
        return transportRecordList; 
    }
    
    

   
}

