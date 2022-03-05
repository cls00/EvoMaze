import "regenerator-runtime/runtime";
import * as nearAPI from "near-api-js";
import getConfig from "./config";


let nearConfig = getConfig(process.env.NODE_ENV || "development");
window.nearConfig = nearConfig;

// Connects to NEAR and provides `near`, `walletAccount` and `contract` objects in `window` scope
async function connect() {
    // Initializing connection to the NEAR node.
    window.near = await nearAPI.connect(Object.assign(nearConfig, {
        deps: {
            keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
        }
    }));

    // Needed to access wallet login
    window.walletAccount = new nearAPI.WalletConnection(window.near);

    // Initializing our contract APIs by contract name and configuration.
    window.contract = await near.loadContract(nearConfig.contractName, {
        viewMethods: ['getSeed','getParent','getTestString', 'getContractSource'],
        changeMethods: ['mutateContract', 'getVariant', 'execMain', 'saveSeed', 'addChild', 'getPopulation', 'testpop'],
        sender: window.walletAccount.getAccountId()
    });
}

function updateUI() {
    if (!window.walletAccount.getAccountId()) {
        Array.from(document.querySelectorAll('.sign-in')).map(it => it.style = 'display: block;');
    } else {
        Array.from(document.querySelectorAll('.after-sign-in')).map(it => it.style = 'display: block;');
        contract.getSeed().then(count => {
            document.querySelector('#show').classList.replace('loader', 'number');
            document.querySelector('#show').innerText = count == undefined ? 'calculating...' : count
        });
        /*
      document.querySelector('#left').classList.toggle('eye');
      document.querySelectorAll('button').forEach(button => button.disabled = false);
      if (count >= 0) {
        document.querySelector('.mouth').classList.replace('cry','smile');
      }else {
        document.querySelector('.mouth').classList.replace('smile','cry');
      }
      if (count > 20 || count < -20) {
        document.querySelector('.tongue').style.display = 'block';
      }else {
        document.querySelector('.tongue').style.display = 'none';
      }
    });*/
    }
}

// Seedable pseudo random number gen
let value = 5;
let seed = 15;
var modulus = 2 ** 32;
var a = 1664525;
var c = 1013904223;

var childv = 44;
let pop = new Map();
pop.set(5,1);

var newSeed = 15;

function getRandom() {
    seed = Math.abs(seed);
    var returnVal = seed / modulus;
    seed = (a * seed + c) % modulus;

    return returnVal;
}

document.querySelector('#Save').addEventListener('click', () => {
    //document.querySelectorAll('button').forEach(button => button.disabled = true);
    document.querySelector('#show').classList.replace('number', 'loader');
    document.querySelector('#show').innerText = '';
    
});


document.querySelector('#ShowContract').addEventListener('click', () => {
    //document.querySelector('#show').classList.replace('number', 'loader');
    //document.querySelector('#show').innerText = '';
    contract.getContractSource().then(result => {console.log(result)});
    
});
document.querySelector('#Mutate').addEventListener('click', () => {
    console.log("mutate");
    contract.getVariant().then(result => {seed = result; newSeed = seed; console.log("mutated")});

    //newSeed = Math.abs(newSeed);
    //contract.decrementCounter({value}).then(updateUI);

});
document.querySelector('#Eval').addEventListener('click', () => {
   // document.querySelectorAll('button').forEach(button => button.disabled = true);
    document.querySelector('#show').classList.replace('number', 'loader');
    document.querySelector('#show').innerText = '';
    
    mazeGeneration();
    //contract.resetCounter().then(updateUI);
});

document.querySelector('#Save').addEventListener('click', () => {
   // document.querySelectorAll('button').forEach(button => button.disabled = true);
    document.querySelector('#show').classList.replace('number', 'loader');
    document.querySelector('#show').innerText = '';
    
    var child = seed;
    console.log(value);
    /*
    contract.saveSeed({
        value
    }).then(updateUI);*/
    contract.addChild({child}).then(result => {console.log(result)});
    
});

document.querySelector('#TestButton').addEventListener('click', () => {    
    childv++;
    //var child = (childv,2);
    /*var child = childv
    console.log(child);
    contract.addChild({child}).then(updateUI);
    pop = contract.getPopulation().then(result => {console.log(result)});*/
    //contract.testpop().then(updateUI);
    contract.getContractSource().then(result => {console.log(result)});
    
    
});

// Log in user using NEAR Wallet on "Sign In" button click
document.querySelector('.sign-in .btn').addEventListener('click', () => {
    walletAccount.requestSignIn(nearConfig.contractName, 'Evo-Maze');
});

document.querySelector('.sign-out .btn').addEventListener('click', () => {
    walletAccount.signOut();
    
    window.location.replace(window.location.origin + window.location.pathname);
});

window.nearInitPromise = connect()
    .then(updateUI)
    .catch(console.error);

function mazeGeneration() {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    // size the canvas to your desired image
    
    var blockResolution = 20
    var blocks = 20
    var sideSize = blockResolution*blocks
    canvas.width = sideSize;
    canvas.height = sideSize;
    // get the imageData and pixel array from the canvas
    var imgData = ctx.getImageData(0, 0, sideSize, sideSize);
    var data = imgData.data;
    
    
    
    for (var i = 0; i < data.length; i += 1) {
        data[i] = 255;      
  }
    
    for (var i = 0; i<blocks; i++){
        for (var j = 0; j<blocks; j++){
            if(getRandom() < 0.50){
                for (var p = 0; p<blockResolution;p++){
                    var x = blockResolution*i + p
                    var y = blockResolution*j + p
                    var pos = (y * sideSize + x) * 4; 
                    data[pos] = 0
                    data[pos+1] = 0
                    data[pos+2] = 0
                    data[pos + 3] = 255
                }
            } else{
                for (var p = 0; p<blockResolution;p++){
                    var x = blockResolution*i + (blockResolution -p)
                    var y = blockResolution*j + p
                    var pos = (y * sideSize + x) * 4; 
                    data[pos] = 0
                    data[pos+1] = 0
                    data[pos+2] = 0
                    data[pos + 3] = 255
                }
            }
        }
    }
    console.log(seed);
    
    seed = newSeed;

    //modified pixels back on the canvas
    ctx.putImageData(imgData, 0, 0);

    // create a new img object
    var image = new Image();
    
    image.src = canvas.toDataURL();
    var div = document.querySelector('#maze');
    //document.querySelector('#maze').appendChild(image);
    div.innerHTML = '';
    div.appendChild(image);
}
