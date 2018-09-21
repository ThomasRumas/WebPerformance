#Launch node server task 
Set-Location C:\Users\10117153\Documents\WebPerformance\;

$i = 0; 
while($i -lt 9999)
{
    #docker run sitespeedio/sitespeed.io:7.4.0 https://www.leroymerlin.fr --graphite.host=10.16.182.77 --webpagetest.host=http://10.16.182.77:4000 --webpagetest.location=Test --webpagetest.connectivity=LAN --webpagetest.run=3
    node .\server.js --url=https://example.com --browser=chrome --iterations=3 --webpagetest=http://localhost:4000
    $i++; 
    Start-Sleep -Seconds 120;
}