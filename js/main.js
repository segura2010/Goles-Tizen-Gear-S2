window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });

    // Sample code
    var mainPage = document.querySelector('#main');

    mainPage.addEventListener("click", function() {
        var contentText = document.querySelector('#content-text');

        contentText.innerHTML = "";
        //contentText.style.display = "none";
        
        getLigue();
    });
};




var API_BASE = "http://goles.eu-gb.mybluemix.net/golesapi/";
var getLigueEndpoint = "nextFixtures";

var MATCH_STATES = { FINISHED:3, IN_GAME:1, NOT_STARTED:0 };

function getLigue(){
	//console.log("Hi!");
	
	// Check if Download API is supported not on a device.
	/*
	 var download_api_capability = tizen.systeminfo.getCapability("http://tizen.org/feature/download");
	 if (download_api_capability === false) {
	     console.log("Download API is not supported on this device.");
	     return;
	 }
	 */

	 var listener = {
	   onprogress: function(id, receivedSize, totalSize) {
	     console.log('Received with id: ' + id + ', ' + receivedSize + '/' + totalSize);
	   },
	   onpaused: function(id) {
	     console.log('Paused with id: ' + id);
	   },
	   oncanceled: function(id) {
	     console.log('Canceled with id: ' + id);
	   },
	   oncompleted: function(id, fullPath) {
	     console.log('Completed with id: ' + id + ', full path: ' + fullPath);
	     readFixtures(fullPath);
	   },
	   onfailed: function(id, error) {
		   document.querySelector('#content-text').innerHTML = "ERROR <br> :(";
	     console.log('Failed with id: ' + id + ', error name: ' + error.name);
	   }
	 };

	 // Starts downloading the file from the Web with the corresponding callbacks.
	 var downloadRequest = new tizen.DownloadRequest(API_BASE+getLigueEndpoint, "documents");
	 var downloadId = tizen.download.start(downloadRequest, listener);
}


function readFixtures(fullPath)
{
	// get file
	tizen.filesystem.resolve(
	   fullPath,
	   function(f) {
		   f.readAsText(function(str) {
		            console.log("The file content " + str);
		            
		            var resultTxt = document.querySelector("#result");
		            resultTxt.innerHTML = "<br><br><br>";
		             
		            var data = JSON.parse(str);
		             
		            var nextFixture = data.nextFixturesList[0];
					var name = nextFixture.tournamentName[0].description +"<br>"+ nextFixture.fixtureName[0].description;
					var nextMatches = nextFixture.fixtureMatchList;
					
					resultTxt.innerHTML += "<span class='tournament-name-text'>"+name+"</span>";
					for(i in nextMatches)
					{
						var visitor = nextMatches[i].teamVisitor;
						var local = nextMatches[i].teamLocal;
						var score = nextMatches[i].score;
						var status = nextMatches[i].matchState;
						var minutes = nextMatches[i].minutes || "";
						//console.log(local+score+visitor);
						
						var style = "";
						
						switch (status) {
						case MATCH_STATES.FINISHED:
							style = "finished";
							break;
							
						case MATCH_STATES.IN_GAME:
							style = "in-game";
							break;
							
						case MATCH_STATES.NOT_STARTED:
							style = "not-started";
							break;

						default:
							break;
						}
						
						resultTxt.innerHTML += "<br><br><span class='fixture-text "+style+"'>" + local + " "+score+" " + visitor + " </span> <span class='minutes-text'>"+minutes+"</span>";
					}
					
					resultTxt.innerHTML += "<br><br><br><br><br><br>";
					
					// Finished, clean
					f.deleteFile(fullPath, function() {
			             console.log("File Deleted");
			           }, function(e) {
			             console.log("Error" + e.message);
			           });
					
		             
		           }, function(e) {
		             console.log("Error " + e.message);
		           }, "UTF-8"
		       );
	   },
	   function(e) { console.log("Error" + e.message);},
	   "rw"
   );
}

