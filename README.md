# WebPerformance Tools 

**Prerequiste :** 

 - Docker (>= v18.06.1-ce, build e68fc7a)  
 - NodeJS  (>= v8.11.4) 
 - NPM (>= v5.6.0)
 - Linux (recommended), Mac OS X or Windows
 - Firefox and/or Chrome
 - You also need to install this requirements : https://github.com/WPO-Foundation/visualmetrics

### This repository contains two programs : 

 - A bash script to launch a Webpagetest server docker container and a Webpagetest agent docker
 - A NodeJS program which use [sitespeed.io](http://sitespeed.io/) or an official docker sitespeed.io image

### Theses programs can be run separately : 

 - `sh script.sh` to launch the Webpagetest docker container
 - `node index.js` to launch a speedtest.io test
 - `docker run --shm-size=1g --rm -v "$(pwd)":/sitespeed.io sitespeedio/sitespeed.io:7.4.0 https://www.leroymerlin.fr --browsertime.connectivity.profile=cable --browsertime.browser=chrome --browsertime.iterations=3 --graphite.host=IpOrHostnameGraphite --webpagetest.host=http://ipOrHostnameWebPageTest:4000 --webpagetest.location=Test --webpagetest.connectivity=cable --webpagetest.run=3` see full documentation to possible [environnement variable](https://www.sitespeed.io/documentation/sitespeed.io/configuration/#the-options)

---
### Webpagetest script

This bash script detect on which operating system it will be launch, throttling only work on Linux system, be sure to launch this command before `sudo modprobe ifb numifbs=1`

The script will ask you on which port you want to launch your Webpagetest docker and give you the right location to access it, by default : `http://localhost:4000`

### Sitespeed.io script

This NodeJS script detect on which operating system it will be launch to use throttling on it (only with Linux and Mac OS X). 

For the first time, don't forget to install dependencies packages with `npm install`, after that, you can launch the script with this command `node index.js`

The script will ask you about parameters :

 - *url* : The url you want to test
 - *browser* : On which browser do you want to initalize the test (default chrome) 
 - *iterations* : The number of iterations do you want to test the same url 
 - *bandwidth* : Only on Linux and Mac OS X operating system, you can choose between theses availables connectivities `3g, 3gfast, 3gslow, 2g, cable`
 - *script* : Like explain on Webpagetest documentation, you can write script test to perform on pages to complete test [documentation](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/scripting)

If you want to have more connectivities, be free to modify the network object in `index.js` file

When test is done, your prompt will return you the location to go to check the result of your test. 

*Update* : Now a server version exist with `server.js` file, to launch it, `node .\server.js --url=https://example.com --browser=chrome --iterations=3 --webpagetest=http://localhost:4000  --bandwidth=cable`

*Update* : If you prefer to launch this tool with docker, this is how to use it : 

Run in Docker (on Linux)
Make sure to run sudo modprobe ifb numifbs=1 before you start the container.
And then when you actually start your Docker container, give it the right privileges with --cap-add=NET_ADMIN

#### Made with love and fun <3


