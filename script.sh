#!/bin/bash

#Ask user to choose a port to expose docker image
echo "Choose a port to deploy Webpagetest Server :";
read port;

if [ $port = "" ]; then
    $port = 4000; 
fi

echo "Test if docker is installed"; 
docker -v || exit_on_error "Please install Docker before using this script"; 

#Build Webpagetest server image
echo "We build and launch Webpagetest Server locally on port http://localhost:$port"; 
cd server; 

if [ "$(uname)" == "Darwin" ]; then
    # Do something under Mac OS X platform  
    echo "Your OS is under Mac OS X platform, traffic control cannot be applied, create Webpagetest server";  
    docker build -t local-wptserver .; 
    docker run -d --rm -p $port:80 local-wptserver;    
    echo "We launch a new docker image for Webpagetest Agent"; 
    docker run -d --rm --network="host" -e "SERVER_URL=http://localhost:$port/work/" -e "LOCATION=Test" -e "SHAPER=none" --cap-add="NET_ADMIN" webpagetest/agent;  
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    # Do something under GNU/Linux platform
    echo "Your OS is under GNU/Linux platform, create Webpagetest server";  
    docker run -d --rm -p $port:80 webpagetest/server;
    echo "We launch a new docker image for Webpagetest Agent"; 
    docker run -d --rm --network="host" -e "SERVER_URL=http://localhost:$port/work/" -e "LOCATION=Test" --cap-add="NET_ADMIN" webpagetest/agent; 
elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
    # Do something under 32 bits Windows NT platform
    echo "Your OS is under 32 bits Windows NT platform, traffic control cannot be applied, create Webpagetest server";
    docker build -t local-wptserver .; 
    docker run -d --rm -p $port:80 local-wptserver; 
    echo "We launch a new docker image for Webpagetest Agent"; 
    docker run -d --rm --network="host" -e "SERVER_URL=http://localhost:$port/work/" -e "LOCATION=Test" -e "SHAPER=none" --cap-add="NET_ADMIN" webpagetest/agent; 
elif [ "$(expr substr $(uname -s) 1 10)" == "MSYS_NT-10" ]; then
    # Do something under 64 bits Windows NT platform
    echo "Your OS is under 64 bits Windows NT platform, traffic control cannot be applied, create Webpagetest server";
    docker build -t local-wptserver .; 
    docker run -d --rm -p $port:80 local-wptserver; 
    echo "We launch a new docker image for Webpagetest Agent"; 
    docker run -d --rm --network="host" -e "SERVER_URL=http://localhost:$port/work/" -e "LOCATION=Test" -e "SHAPER=none" --cap-add="NET_ADMIN" webpagetest/agent; 
fi

echo "You can now go on http://localhost:$port and perform WebPageTest"; 