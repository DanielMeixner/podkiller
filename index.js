const k8s = require('@kubernetes/client-node');
const readline = require('readline');
const fs = require('fs');
const request = require('request-promise');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts = {};
kc.applyToRequest(opts);


var namespacesstring = process.env.PODKILLER_NAMESPACES;
var debugstr = process.env.PODKILLER_DEBUG | "false";
var debug = false;
if (debugstr == "true") { debug = true;}
var showquotes = process.env.PODKILLER_QUOTES | true;
if(showquotes == "true") {showquotes = true;}



// namespaces env var is allowed to contain comma separated names like "default,kube-system"
if(namespacesstring==undefined)
{
    namespacesstring="default";
}
var namespaceslist = namespacesstring.split(",");




var bodycount=0;

// read quotes file
var quotes = [];
let rl = readline.createInterface({
    input: fs.createReadStream('quotes.txt')
});
rl.on('line', function(line) {    
   quotes.push(line);
});



namespaceslist.forEach(element => {
    killPodsInNamespace(element);
});


function killPodsInNamespace(ns) {

    console.log("Killing all pods in namespace "+ ns);
    
    var item = "default"
    var url = `${kc.getCurrentCluster().server}/api/v1/namespaces/`+ns+`/pods`;
    // get deployments from namespace
    request.get(url, opts).then(function (response) {
        
        var deploymentlist = JSON.parse(response).items;
        deploymentlist.forEach(element => {            
            var podname = element.metadata.name;

            // don't kill yourself
            if (podname.includes("podkiller")) {
                console.log("I'm a podkiller - but I don't kill myself: " +  podname);
            }
            else
            {
                var deleteurl = `${kc.getCurrentCluster().server}/api/v1/namespaces/`+ns+`/pods/` + podname;
                
                if(debug) {console.log("deleteurl" + deleteurl);}

                request.delete(deleteurl, opts).then
                    (function (req, podname) {
                        
                        var podname= JSON.parse(req).metadata.name;
                        console.log( podname );
                        console.log("Bodycount:" + ++bodycount +  " " + (showquotes? getQuote():""));
                    });
            }
        });

    });
}

function getQuote()
{
    var max = quotes.length -1;
    // good enough
    var r= Math.floor( Math.random(0,max) * max);
    return "\"" + quotes[r] +"\"";
}






