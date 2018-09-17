"use strict"; 

//Sitespeed ressources
const sitespeed = require('sitespeed.io/lib/sitespeed');
const throttle = require('@sitespeed.io/throttle');

//Webpagetest API default value
var urlWebPageTest = "http://localhost:4000"; 

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

prompt.start(); 

//Because traffic control doesn't work on win32 system
if(OS === "win32") {
    prompt.get(['url', 'browser', 'iterations', 'webpagetest', 'script', 'useragent'], (err, result) => {     
        sitespeed.run(generateOptions(result)).then((resultTest) => {
            console.log(`The test is done, go to ${__dirname}${resultFolder}/index.html to see results`); 
        });
    }); 
} else {
    prompt.get(['url', 'browser', 'iterations', 'bandwidth', 'webpagetest', 'script', 'useragent'], (err, result) => {
        var bandwidth = result.bandwidth == "" ? "cable" : result.bandwidth; 

        throttle.start({up:network[bandwidth].up, down:network[bandwidth].down, rtt:network[bandwidth].rtt}).then(() => {
            sitespeed.run(generateOptions(result)).then((resultTest) => {
                console.log(`The test is done, go to ${__dirname}${resultFolder}/index.html to see results`); 
            });
        })
        .catch((error) => {
            console.log(error); 
        });
    });
}

function generateOptions(result) {
    /*
    https://github.com/marcelduran/webpagetest-api
    --webpagetest.host          The domain of your WebPageTest instance.
    --webpagetest.key           The API key for your WebPageTest instance. Not needed if private instance
    --webpagetest.location      The location for the test
    --webpagetest.connectivity  The connectivity for the test.
    --webpagetest.runs          The number of runs per URL.
    --webpagetest.custom        Execute arbitrary Javascript at the end of a test to collect custom metrics.
    --webpagetest.script        Direct WebPageTest script as a string
    --webpagetest.file          Path to a script file
    --webpagetest.useragent     User-agent to declare to go on the webpage, only working on Chrome
    */
    let prmUrl = result.url; 
    let prmBrowser = result.browser == "" ? "chrome" : result.browser; 
    let prmIterations = result.iterations == "" ? 3 : parseInt(result.iterations); 
    let prmFile = result.file == "" ? "" : result.file; 
    //LAN because of Windows and Mac OS X, name we give on our builded docker image
    let prmConnectivity = result.bandwidth == "" || result.bandwidth === undefined ? "LAN" : result.bandwidth;  
    let prmUserAgent = result.useragent == "" || result.useragent === undefined ? "" : result.useragent; 
    urlWebPageTest = result.webpagetest; 

    return ({
        urls: [prmUrl], 
        outputFolder: __dirname + resultFolder,
        browsertime: {
            browser: prmBrowser,
            connectivity: prmConnectivity,
            iterations: prmIterations, 
            userAgent: prmUserAgent
        }, 
        webpagetest: {
            host: urlWebPageTest,
            location: "Test",
            pollResults: 10,
            timeout: 600,
            includeRepeatView: false,
            private: false,
            aftRenderingTime: true,
            connectivity: prmConnectivity,
            video: true, 
            run: prmIterations, 
            useragent: prmUserAgent, 
            file: prmFile
        }
    });
}

