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

        contentText.innerHTML = (contentText.innerHTML === "Basic") ? "Tizen" : "Basic";
        
        getLigue();
    });
};




var API_BASE = "http://192.168.1.128:3000/golesapi/";
var getLigueEndpoint = "nextFixtures";


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
	     console.log('Failed with id: ' + id + ', error name: ' + error.name);
	   }
	 };

	 // Starts downloading the file from the Web with the corresponding callbacks.
	 var downloadRequest = new tizen.DownloadRequest(API_BASE+getLigueEndpoint, "documents");
	 var downloadId = tizen.download.start(downloadRequest, listener);
	
	//$("body").html("");
	/*
	$.ajax({
		url:API_BASE+getLigueEndpoint,
		type:"POST",
		data:'{"appId":2,"idLeague":1}',
		contentType:"application/json; charset=utf-8",
		dataType:"json"
	}).done(function( data ) {
		console.log( data );
		$("body").html("HOLA!");
		
		var nextFixture = data.nextFixturesList[0];
		var name = nextFixture.fixtureName[0].description;
		var nextMatches = nextFixture.fixtureMatchList;
		for(i in nextMatches)
		{
			var visitor = nextMatches[i].teamVisitor;
			var local = nextMatches[i].teamLocal;
			var score = nextMatches[i].score;
			console.log(local+score+visitor);
			$("body").append("<br><span class=content_text>" + local + " "+score+" " + visitor + "</span>");
		}
	}).fail(function(err, status){
		$("body").append(err);
		console.log(err);
	});
	*/
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
		            resultTxt.innerHTML = "";
		             
		            var data = JSON.parse(str);
		             
		            var nextFixture = data.nextFixturesList[0];
					var name = nextFixture.fixtureName[0].description;
					var nextMatches = nextFixture.fixtureMatchList;
					for(i in nextMatches)
					{
						var visitor = nextMatches[i].teamVisitor;
						var local = nextMatches[i].teamLocal;
						var score = nextMatches[i].score;
						console.log(local+score+visitor);
						resultTxt.innerHTML += "<br><span class=fixture-text>" + local + " "+score+" " + visitor + "</span>";
					}
					
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

