"use strict"; 

//Sitespeed ressources
const sitespeed = require('sitespeed.io/lib/sitespeed');
const throttle = require('@sitespeed.io/throttle');

//Prompt ressources to ask users parameters 
const prompt = require('prompt'); 

const resultFolder = "/result-" + Date.now(); 
const OS = process.platform; 

const network = {
    '3g' : {
        'up': 768, 
        'down': 1600, 
        'rtt': 150
    }, 
    '3gfast' : {
        'up': 768, 
        'down': 1600, 
        'rtt': 75
    }, 
    '3gslow' : {
        'up': 400, 
        'down': 400, 
        'rtt': 200
    }, 
    '2g' : {
        'up': 32, 
        'down': 35, 
        'rtt': 650
    }, 
    'cable' : {
        'up': 1000, 
        'down': 5000, 
        'rtt': 14
    }
}

var prmUrl = ""; 
var prmBrowser = "chrome";
var prmIterations = 3; 

prompt.start(); 

//Because traffic control doesn't work on win32 system
if(OS === "win32") {
    prompt.get(['url', 'browser', 'iterations'], (err, result) => {     
        sitespeed.run(generateOptions(result)).then((result) => {
            console.log(`The test is done, go to ${__dirname}${resultFolder}/index.html to see results`); 
        });
    }); 
} else {
    prompt.get(['url', 'browser', 'iterations', 'bandwidth'], (err, result) => {
        var bandwidth = result.bandwidth == "" ? "cable" : result.bandwidth; 

        throttle.start({up:network[bandwidth].up, down:network[bandwidth].down, rtt:network[bandwidth].rtt}).then(() => {
            sitespeed.run(generateOptions(result)).then((result) => {
                console.log(`The test is done, go to ${__dirname}${resultFolder}/index.html to see results`); 
            });
        })
        .catch((error) => {
            console.log(error); 
        });
    });
}

function generateOptions(result) {
    prmUrl = result.url; 
    prmBrowser = result.browser == "" ? "chrome" : result.browser; 
    prmIterations = result.iterations == "" ? 3 : parseInt(result.iterations); 

    return ({
        urls: [prmUrl], 
        outputFolder: __dirname + resultFolder,
        browsertime: {
            browser: prmBrowser,
            connectivity: 'native',
            iterations: prmIterations,
        }
    });
}

