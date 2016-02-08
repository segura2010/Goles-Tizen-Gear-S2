
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
    
    rotaryDetentCallback = function rotaryDetentHandler(e) {
	    var direction = e.detail.direction;
	    if (direction === "CW") {
	        // TODO: do something when rotated clockwise
	    	
	    	nextFixture();
	    	showFixture(actFixtures, ACT_FIXTURE);
	    	console.log("CW");

	    } else if (direction === "CCW") {
	        // TODO: do something when rotated counter clockwise

	    	prevFixture();
	    	showFixture(actFixtures, ACT_FIXTURE);
	    	console.log("CCW");
	    	
	    }
	};
	window.addEventListener("rotarydetent", rotaryDetentCallback);

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

var actFixtures = {}; // Save a cache of obtained fixtures!!
var ACT_FIXTURE = 0;


function showFixture(data, i)
{
	ACT_FIXTURE = i;
	var nextFixture = data.nextFixturesList[i];
	
	var resultTxt = document.querySelector("#result");
    resultTxt.innerHTML = "<br><br><br>";
	
	var name = nextFixture.tournamentName[0].description +"<br>"+ nextFixture.fixtureName[0].description;
	var nextMatches = nextFixture.fixtureMatchList;
	
	resultTxt.innerHTML += "<br> <span class='tournament-name-text'>"+name+"</span>";
	for(i in nextMatches)
	{
		var visitor = nextMatches[i].teamVisitor;
		var local = nextMatches[i].teamLocal;
		var score = nextMatches[i].score;
		var status = nextMatches[i].matchState;
		var tv = nextMatches[i].listTV;
		var date = nextMatches[i].dateMatch;
		date = moment(date).lang(navigator.language).calendar();
		//console.log(local+score+visitor);
		
		var style = "";
		
		switch (status) {
		case MATCH_STATES.FINISHED:
			style = "finished";
			date = "";
			tv = "";
			break;
			
		case MATCH_STATES.IN_GAME:
			style = "in-game";
			date = "";
			break;
			
		case MATCH_STATES.NOT_STARTED:
			style = "not-started";
			score = "-";
			break;

		default:
			break;
		}
		var minutes = nextMatches[i].minutes || date;
		
		resultTxt.innerHTML += "<br><br><span class='fixture-text "+style+"'>" + local + " "+score+" " + visitor + " </span> <br> <span class='minutes-text'>"+ minutes +"</span> <span class='tvs-text'>"+ tv +"</span>";
	}
	
	resultTxt.innerHTML += "<br><br><br><br><br><br>";
}

function readFixtures(fullPath)
{
	// get file
	tizen.filesystem.resolve(
	   fullPath,
	   function(f) {
		   f.readAsText(function(str) {
		            console.log("The file content " + str);
		             
		            var data = JSON.parse(str);
		             
		            actFixtures = data;
		            showFixture(data, 0);
					
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

function nextFixture()
{
	ACT_FIXTURE = (ACT_FIXTURE + 1) % actFixtures.nextFixturesList.length;
}

function prevFixture()
{
	ACT_FIXTURE = (ACT_FIXTURE - 1) % actFixtures.nextFixturesList.length;
}

function bezerInit()
{
	// BEZEL SCROLL
	var page = document.getElementById("main"),
	element = document.getElementById("sectionchanger"),
	sectionChanger, idx=1;
	
	page.addEventListener("pageshow", function() {
	   /* Create the SectionChanger object */
	   sectionChanger = tau.widget.SectionChanger(element, {
	      circular: true,
	      orientation: "horizontal",
	      useBouncingEffect: true
	   });
	});
	
	page.addEventListener("pagehide", function() {
	   /* Release the object */
	   sectionChanger.destroy();
	});
}





