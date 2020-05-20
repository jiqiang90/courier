/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

}

const ABI = [{"constant":true,"inputs":[{"name":"track","type":"string"}],"name":"getConsignment","outputs":[{"name":"","type":"string"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ConsignmentList","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getKeyPairs","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_shipper","type":"address"},{"name":"_shipperInfo","type":"string"},{"name":"_recipient","type":"address"},{"name":"_recipientPartialKey","type":"string"},{"name":"_recipientInfo","type":"string"},{"name":"_itemInfo","type":"string"},{"name":"_cost","type":"uint256"},{"name":"_principal","type":"address"},{"name":"_keyPairAddress","type":"address"},{"name":"_trackingNum","type":"string"}],"name":"setConsignment","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTransportRecords","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"KeyPairList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_time","type":"bytes32"}],"name":"getTransportRecord","outputs":[{"name":"","type":"string"},{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_keyAddress","type":"address"},{"name":"_sender","type":"address"},{"name":"_receiver","type":"address"},{"name":"_privKey","type":"string"},{"name":"_pubKey","type":"string"}],"name":"setKeyPair","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"keyAddress","type":"address"}],"name":"getCiphertext","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_keyAddress","type":"address"},{"name":"_iv","type":"string"},{"name":"_ephemPublicKey","type":"string"},{"name":"_ciphertext","type":"string"},{"name":"_mac","type":"string"}],"name":"pushCiphertext","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_contractor","type":"address"},{"name":"_consignment","type":"string"},{"name":"_time","type":"bytes32"},{"name":"_status","type":"string"},{"name":"_location","type":"string"},{"name":"_recipient","type":"address"}],"name":"setTransportRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"ins","type":"address"}],"name":"getKeyPair","outputs":[{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"CiphertextList","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"transportRecordList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"contractAddress","type":"address"},{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"privKey","type":"string"},{"indexed":false,"name":"pubKey","type":"string"}],"name":"KeyPairInfo","type":"event"}];

var Web3Utils = require('web3-utils');


var app = angular.module('myApp', []);


/***************MOMENT JS, LOCALIZE TIME*********/

app.directive('timestamp', timestamp);
function timestamp($http) {
    return {
        restrict: 'E', // if it's element
        scope: {time: '=time'},
        template: "<span>{{human_time}}</span>", // example template
        link: function (scope, element, attrs) {
            scope.human_time = moment(scope.time).format('MMMM Do YYYY, h:mm:ss a')

        }
    };
}
/**************END***************/


/***************JSON LINE BREAK TO HTML*********/

app.directive('jsontext', jsontext);
function jsontext($sce) {
    return {
        restrict: 'E', // if it's element
        scope: {text: '=text'},
        template: "<p ng-bind-html ='html_text' ></p>", // example template
        link: function (scope, element, attrs) {
            scope.html_text =$sce.trustAsHtml(scope.text.replace(/\r\n|\\n|\n|\r/g, '<br />'));

        }
    };
}
/**************END***************/


app.run(function($rootScope) {

    $rootScope.all_accounts= web3.eth.accounts;
    $rootScope.ShipperRecipientContractAdd = "0x136EAd33F1D85537E6E408E6d82704d24eB9A6d5";
    $rootScope.ShipperPrincipalContractAdd = "0x62C4be99eCFB0dC51fEB349982DE4D5b7f3e5F8F";
    $rootScope.TransportContractAdd = "0x8708F2895d749e8D7b7123236249aC3265eB1733";


    $rootScope.ShipperRecipientContract = web3.eth.contract(ABI);
    $rootScope.ShipperPrincipalContract = web3.eth.contract(ABI);
    $rootScope.TransportContract = web3.eth.contract(ABI);


    $rootScope.recordStatus_options = {
    model: null,
    availableOptions: [
        {name: 'Collected from shipper',value:'colleted'},
        {name: 'In transit to local depot',value:'transit'},
        {name: 'At local/regional depot',value:'at_deport'},
        {name: 'With courier for delivery',value:'out_delivery'},
        {name: 'Delivery attempted',value:'delivery_attempted'},
        {name: 'Delivery successful',value:'delivery_successful'},
        {name: 'Item lost',value:'item_lost'}
    ]
   };


    $rootScope.generateKeys = function () {
        var EthCrypto = require('eth-crypto');
        var identity = EthCrypto.createIdentity();
        console.log();
        return identity;
    }



    $rootScope.storeKeyPair = function ($contract, $contractAddress,$keyAddress, $sender_account,$receiver_account,$privKey, $publicKey){
        //Set up shipper role, recipient role, and store the keys
        var storeKey = $contract.at($contractAddress);
        var keyPair = storeKey.setKeyPair($keyAddress, $sender_account,$receiver_account,$privKey, $publicKey,{from: web3.eth.defaultAccount , gas:3000000});
        //console.log(keyPair);
        if(keyPair){
            window.alert('Key pair stored successful!')
        }
        
    }



    $rootScope.getKeyPair = function ($contract, $contractAddress, $keyAddress){  //get Key pairs by contract address, msg_sender has to be one of party
        var contract = $contract.at($contractAddress);
        var keyPair = contract.getKeyPair($keyAddress);
        return keyPair;
    }


    async function encryption($plainText,$KeyPair) {
        var EthCrypto = require('eth-crypto');
        console.log($KeyPair[3]);
        const encrypted = await EthCrypto.encryptWithPublicKey($KeyPair[3], $plainText);
        return encrypted;
    }

    $rootScope.encrypted_item ={}; //default is empty

    $rootScope.generateEncrypt = function ($plainText,$KeyPair){  //generate local ciphertext, and output target encrypted_item
        var encrypted = encryption ($plainText,$KeyPair);
        encrypted.then(function(data){
            $rootScope.encrypted_item = data;
            window.alert('Ciphertext generated');
        })
    }


    $rootScope.setEncrypt = function($contract,$contractAddress,$msg_sender){ //push local Ciphertext to contract
        web3.eth.defaultAccount = $msg_sender; //Confirm requester identity
        var contract = $contract.at($contractAddress); 
        var setCiphertext = contract.pushCiphertext(
              $contractAddress,
             $rootScope.encrypted_item.iv,
             $rootScope.encrypted_item.ephemPublicKey,
            $rootScope.encrypted_item.ciphertext,
            $rootScope.encrypted_item.mac,
            {from: $msg_sender , gas:3000000}
        )
        window.alert('Ciphertext in contract');
        $rootScope.encrypted_item ={}; //reset to empty;
    }



    $rootScope.getCiphertext = function ($contract,$contractAddress,$msg_sender){
        web3.eth.defaultAccount = $msg_sender; //Confirm requester identity
        var contract = $contract.at($contractAddress); 
         var ciphertext = contract.getCiphertext($contractAddress);
         return {
            iv: ciphertext[0],
            ephemPublicKey: ciphertext[1],
            ciphertext: ciphertext[2],
            mac: ciphertext[3]
        };
     }

    async function decryption($ciphertext, $KeyPair) {
        var EthCrypto = require('eth-crypto');
        console.log($KeyPair[2], $ciphertext);
        const message = await EthCrypto.decryptWithPrivateKey($KeyPair[2], $ciphertext)
        return message;
    }


    $rootScope.decryptCiphertext = function ($ciphertext, $KeyPair){
        message = decryption($ciphertext, $KeyPair);
        message.then(function(data){
            window.alert('Ciphertext decryped successful: ' + data + '.');
        })
     }


    $rootScope.getConsignment = function ($contractAddress, $trackingNum, $msg_sender){

        var storeConsignment = $rootScope.ShipperRecipientContract.at($contractAddress);
        var consignment = storeConsignment.getConsignment($trackingNum);
        return consignment;

    }

    $rootScope.timepoint = '';

    $rootScope.setRecord = function ($msg_sender, $consignment, $status, $location,$recipientAddress,$contractAddress){

        web3.eth.defaultAccount = $msg_sender; //Confirm requester identity

        var timeNow = new Date();
        var time = ''+ timeNow.getTime();
        $rootScope.timepoint =Web3Utils.asciiToHex(time);

        var contract = $rootScope.TransportContract.at($contractAddress); 

    
        var setRecord = contract.setTransportRecord(
            $msg_sender,
            $consignment,
            $rootScope.timepoint,
            $status,
            $location,
            $recipientAddress, //recipent
            {from: $msg_sender , gas:3000000}
        )
        
   

        window.alert('Record in contract, Hex is '+ $rootScope.timepoint);
    }


    $rootScope.getRecord = function ($timepoint,$contractAddress){
        var contract = $rootScope.TransportContract.at($contractAddress); 
        var transportRecord = contract.getTransportRecord($timepoint);

        $rootScope.timepoint = ''; //reset timepoint

        console.log('Get record, timepoint is '+ Web3Utils.hexToAscii($timepoint) + '. And byte32 is ' + $timepoint);

        $rootScope.lastRecord = transportRecord;
        return transportRecord;
    }

    $rootScope.fullRecords = {};

    $rootScope.getRecords = function ($contractAddress){
        var contract = $rootScope.TransportContract.at($contractAddress); 
        var transportRecords = contract.getTransportRecords();
        return transportRecords;
    }


    $rootScope.toReadableTime = function($acii){


        $time = parseInt( Web3Utils.hexToAscii($acii));

        return $time;

    }

    $rootScope.boolAccessConsignment = false;
    $rootScope.accessConsignment = function ($Contract, $ContractAdd, target_account){
        web3.eth.defaultAccount = target_account;
        $target_keyPair = $rootScope.getKeyPair ($Contract, $ContractAdd, target_account);
        $target_pubKey = $target_keyPair[3];


        $ciphertext = $rootScope.getCiphertext($Contract, $ContractAdd, target_account);
        if ($target_keyPair){
            //change identity, as delivery staff
            web3.eth.defaultAccount = $target_keyPair[0];
            $init_keyPair = $rootScope.getKeyPair ($Contract, $ContractAdd, target_account);
            $init_pubkey = $init_keyPair[3];
            if (($target_pubKey ===  $init_pubkey) && $ciphertext) {
                window.alert ('Allow recipient : ' + target_account + 'access to Publick key in consignment')
                $rootScope.boolAccessConsignment = true;
            }
        }
        web3.eth.defaultAccount = target_account;
    }

    $rootScope.getConsignmentFromRecord = function ($TransportContractAdd){

        var TransportRecords = $rootScope.getRecords($TransportContractAdd);
        console.log(TransportRecords);
        var lastRecord = $rootScope.getRecord(TransportRecords[TransportRecords.length-1], $TransportContractAdd);
        return lastRecord[0];
    }



});

app.controller('shipperCtrl', function($scope,$rootScope) {


    $scope.shipper_account = web3.eth.accounts[0];
    $scope.recipient_account = web3.eth.accounts[1];
    $scope.principal_account = web3.eth.accounts[2];
    web3.eth.defaultAccount = $scope.shipper_account; //shipper account as defualt user


    $scope.getShipperRecipientKeys = function () {
        console.log('create shipper & recipient key');
        var EthCrypto = require('eth-crypto');
        var identity = EthCrypto.createIdentity();
        $scope.ShipperRecipientKeys = identity;
    }

    $scope.getShipperPrincipalKeys = function () {
        console.log('create shipper & principal key');
        var EthCrypto = require('eth-crypto');
        var identity = EthCrypto.createIdentity();
        $scope.ShipperPrincipalKeys = identity;
    }


    $scope.splitKey = function ($Key){

        $scope.PartialKeyStore = $Key.slice(0, ($Key.length/2));
        $scope.PartialKeyTransfer = $Key.slice(($Key.length/2), ($Key.length));

    }



    $scope.shipping_cost = 2; //Default shipping cost

    $scope.setShipperRecipientKeys = function ($contract, $contractAddress,$keyAddress, $sender_account,$receiver_account,$privKey, $publicKey){
        var store = $rootScope.storeKeyPair ($contract, $contractAddress,$keyAddress, $sender_account,$receiver_account,$privKey, $publicKey);
        $scope.ShipperRecipientKeyPair = $rootScope.getKeyPair($rootScope.ShipperRecipientContract, $rootScope.ShipperRecipientContractAdd, $receiver_account);
    }


    $scope.setShipperPrincipalKeys = function ($contract, $contractAddress,$keyAddress, $sender_account,$receiver_account,$privKey, $publicKey){
        var store = $rootScope.storeKeyPair($contract, $contractAddress,$keyAddress, $sender_account,$receiver_account,$privKey, $publicKey);
        $scope.ShipperPrincipalKeyPair = $rootScope.getKeyPair($rootScope.ShipperPrincipalContract, $rootScope.ShipperPrincipalContractAdd, $receiver_account);
    }





    $scope.createConsignment = function (shipper_account, shipper_name, shipper_address ,recipient_account,recipientPartialKey, recipient_name ,recipient_address, item_description ,item_weight ,item_value ,shipping_cost, ShipperPrincipalContractAdd, principal_account){

        var trackingNum = 'NZ' + Math.floor(100000000 + Math.random() * 900000000); // generate a random number but not unique
        var storeConsignment = $scope.ShipperRecipientContract.at($rootScope.ShipperPrincipalContractAdd);
        var consignment = storeConsignment.setConsignment(
            shipper_account,
            'From : ' + shipper_name + '. Address :' + shipper_address,
            recipient_account,
            recipientPartialKey,
            'To : ' + recipient_name + '. Address :' + recipient_address,

            'Item : ' + item_description + '. Weight : ' + item_weight + '. Value: '+  item_value ,
            
            shipping_cost, 
            ShipperPrincipalContractAdd, 
            principal_account,

            trackingNum ,
            {from: web3.eth.defaultAccount  , gas:3000000});

        window.alert('Consignment created , tracking number: ' + trackingNum);
        $scope.consignment = $rootScope.getConsignment ($rootScope.ShipperPrincipalContractAdd, trackingNum, web3.eth.defaultAccount);
    }



   

});



app.controller('principalCtrl', function($scope,$rootScope){

    web3.eth.defaultAccount = $rootScope.all_accounts[2]; //principal account 

    $scope.shipper_account = web3.eth.accounts[0];
    $scope.recipient_account = web3.eth.accounts[1];
    $scope.principal_account = web3.eth.accounts[2];

    $scope.setPrincipalSubcontractorRecord = function($msg_sender, $consignment, $status, $location,$recipientAddress,$contractAddress){

        $consignment_reformat  ='Tracking: ' + $consignment[7] + '\\n'+  $consignment[1] + '\\n' + $consignment[3] + '\\n' + $consignment[4] + '\\n'+ 'Public key transfered: <code>' + $consignment[2] + '</code>';

        //$consignment_reformat = 'Tracking: NZ613587356\n0xec6a6e677feafe4c5209c92ddbe98fd0bd3e6756\nTo : Toon. Address :Christchurch\nItem : imac. Weight : 80. Value: 20\nPublic key transfered: 8679e9757127695386dd11b4dadb939e85ced6279cb1447710aafa890f1377fb';
        
        $rootScope.setRecord($msg_sender, $consignment_reformat, $status, $location,$recipientAddress, $contractAddress);
        //var record = $rootScope.getRecord($rootScope.timepoint,$contractAddress);
        //return record;
        
    }


    $scope.setContractorKeys = function ($contract, $contractAddress,$keyAddress, $sender_account,$receiver_account,$privKey, $publicKey){
        var store = $rootScope.storeKeyPair ($contract, $contractAddress,$keyAddress, $sender_account,$receiver_account,$privKey, $publicKey);
    }






});



app.controller('recipientCtrl', function($scope,$rootScope){


    $scope.shipper_account = web3.eth.accounts[0];
    $scope.recipient_account = web3.eth.accounts[1];
    $scope.principal_account = web3.eth.accounts[2];

    web3.eth.defaultAccount = $rootScope.all_accounts[1]; //principal account 

    $scope.mergePublicKey = function ($FullShipperRecipientKey, $ShipperRecipientKeyPair){

        $ShipperRecipientKeyPair[3] = $FullShipperRecipientKey;
        console.log($ShipperRecipientKeyPair);
        return $ShipperRecipientKeyPair;
    }





});



app.controller('subcontractorCtrl', function($scope,$rootScope){


    $scope.shipper_account = web3.eth.accounts[0];
    $scope.recipient_account = web3.eth.accounts[1];
    $scope.principal_account = web3.eth.accounts[2];

      $scope.update_default_account= function($account){
            web3.eth.defaultAccount = $account; //principal account 
      }

    $scope.setSubcontractorRecord = function($msg_sender, $consignment, $status, $location,$recipientAddress, $contractAddress){
        $rootScope.setRecord($msg_sender, $consignment, $status, $location, $recipientAddress, $contractAddress);
    }






});







/*

CoursetroContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_age","type":"uint256"},{"name":"_fName","type":"string"},{"name":"_lName","type":"string"}],"name":"setInstructor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"fName","type":"string"},{"indexed":false,"name":"lName","type":"string"},{"indexed":false,"name":"age","type":"uint256"}],"name":"instructorInfo","type":"event"},{"constant":true,"inputs":[],"name":"countInstructors","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"getInstructor","outputs":[{"name":"","type":"uint256"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getInstructors","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"instructorAccts","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]);
var Coursetro = CoursetroContract.at('0x2dDF6A73F32d9bc73f363Beab8569E62f56B0eAe');

var instructorEvent = Coursetro.instructorInfo({}, 'latest');

instructorEvent.watch(function (error, result) {
    if (result) {
        if (result.blockHash !== $("#insTrans").html())
            $("#loader").hide();

        $("#insTrans").html('Block hash: ' + result.blockHash);
        $("#instructor").html(result.args.fName + ' ' + result.args.lName + ' (' + result.args.age + ' years old)');
    } else {
        $("#loader").hide();
    }
});


Coursetro.countInstructors((err, res) => {
    if (res)
        $("#countIns").html(res.c + ' Instructors');
});


$("#button").click(function () {
    $("#loader").show();
    Coursetro.setInstructor(web3.eth.defaultAccount, $("#age").val(), $("#fName").val(), $("#lName").val(), (err, res) => {
        if (err) {
            $("#loader").hide();
        }
    });
});

*/