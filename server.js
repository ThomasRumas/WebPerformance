"use strict"; 
//Sitespeed ressources
const sitespeed = require('sitespeed.io/lib/sitespeed');
const throttle = require('@sitespeed.io/throttle');

//Webpagetest API default value
var urlWebPageTest = "http://localhost:4000"; 

//Argument from nodeJS 
const argv = require('minimist')(process.argv.slice(2));

const resultFolder = `/sitespeed-result/${getFormattedDate()}-`; 
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

//Because traffic control doesn't work on win32 system
if(OS === "win32") {  
    sitespeed.run(generateOptions(argv)).then((result) => {
        console.log(`The test is done, go to ${__dirname}${resultFolder}/index.html to see results`);  
    });
} else {
    var bandwidth = argv.bandwidth == "" ? "cable" : argv.bandwidth; 

    throttle.start({up:network[bandwidth].up, down:network[bandwidth].down, rtt:network[bandwidth].rtt}).then(() => {
        sitespeed.run(generateOptions(argv)).then((result) => {
            console.log(`The test is done, go to ${__dirname}${resultFolder}/index.html to see results`); 
        });
    })
    .catch((error) => {
        console.log(error); 
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
    let prmFile = result.script == "" ? "" : result.script; 
    let prmConnectivity = result.bandwidth == "" || result.bandwidth === undefined ? "LAN" : result.bandwidth; //LAN because of Windows and Mac OS X, name we give on our builded docker image
    let prmUserAgent = result.useragent == "" || result.useragent === undefined ? "" : result.useragent; 
    urlWebPageTest = result.webpagetest; 
    let formatedUrl = prmUrl.replace(/(^\w+:|^)\/\//, '');; 

    return ({
        urls: [prmUrl], 
        outputFolder: __dirname + resultFolder + formatedUrl,
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
        },
        graphite: {
            host: "localhost",
            auth: "sitespeedio:hdeAga76VG6ga7plZ1", 
            port: 2003
        }
    });
}

/*function generateJsonFromHar(pathToData, file) {
    let har = fs.readFileSync(`${pathToData}/data/${file}`, 'utf8', (err, data) => {
        if(err) throw err; 
        return data; 
    }); 

    return pagexray.convert(JSON.parse(har));
}*/

function getFormattedDate() {
    var date = new Date(Date.now());

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = date.getFullYear() + "-" + month + "-" + day + "_" +  hour + "h" + min + "m" + sec;

    /*alert(str);*/

    return str;
}


