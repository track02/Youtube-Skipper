
	mins = document.getElementById("min");
	secs = document.getElementById("sec");
	enabled = document.getElementById("enabled");
	playPause = document.getElementById("play_pause");
	pause = document.getElementById("pause");
	next = document.getElementById("next");
	prev = document.getElementById("prev");
	timSkpF = document.getElementById("time_skip_fwd");
	timSkpB = document.getElementById("time_skip_back");
	volumeSlider = document.getElementById("volume_slider")

	skipValue = 5;
	pause = true;
	
	play_html = "<i class=\"fa fa-play\"></i>";
	pause_html = "<i class=\"fa fa-pause\"></i>";

	
	function enableHandler(event){

		//Write to storage - Active_State = True
		browser.storage.local.set({activeState: enabled.checked, 
								   minutes: mins.value, 
								   seconds: secs.value,
								   });				
	}
	
	function onInputHandler(event){
		browser.storage.local.set({activeState: true,
								   minutes: mins.value, 
								   seconds: secs.value,
								   });
	}	

	function onChangeHandler(event){
		browser.storage.local.set({vslider: volumeSlider.value});
		sendCommand("adjust volume", volumeSlider.value);
	}		

	function playPauseHandler()	{
		sendCommand("play");
		sendCommand("pause status");
	}	

	function initialiseValues(data){

		activeState = (data.activeState);
			
		if(activeState == true){
			enabled.checked = true;
		}
		else{
			enabled.checked = false;
		}

		volumeSlider.value = data.vslider;
		mins.value = data.minutes;
		secs.value = data.seconds;
	}


	function sendCommand(cmd, param){

		function msgTabs(tabs) {
			for (let tab of tabs) {

				if(tab.url.indexOf("youtube") != -1 && tab.url.indexOf("watch?") != -1){

					browser.tabs.sendMessage(tab.id, {command: cmd, parameter: param})
											.then(response => {

												if (cmd === "video title"){
													document.getElementById("now_playing").innerHTML = response.value;
												}

												if (cmd === "next video title"){
													document.getElementById("up_next").innerHTML = response.value;
												}
											});
				}  	
			}
		}

		var querying = browser.tabs.query({}); //Create a query to fetch all tabs
		querying.then(msgTabs); //If successful send a message to each tag
	}

	browser.runtime.onMessage.addListener(request => {

		cmd = request.command;
		param = request.parameter;

		console.log("Received Message: " + cmd);
		
		if(cmd == "return pause"){
			pause = param;
			if (pause == false){			
				playPause.innerHTML = pause_html;
			}
			else if (pause == true){
				playPause.innerHTML = play_html;
			}
		}

		if (cmd === "update headings"){
			sendCommand("video title");
			sendCommand("next video title");
		}
	});

	//Initialisation
	browser.storage.local.get().then(initialiseValues);	

	mins.oninput = onInputHandler;
	secs.oninput = onInputHandler;
	enabled.onclick = enableHandler;
	
	playPause.onclick = playPauseHandler;
	next.onclick = function(e) {sendCommand("next video")};
	prev.onclick = function(e) {sendCommand("prev video")};
	timSkpF.onclick = function(e) {sendCommand("time skip f", skipValue)};
	timSkpB.onclick = function(e) {sendCommand("time skip b", skipValue)};
	volumeSlider.onchange = onChangeHandler;	
	
	//Request video details on page load
	sendCommand("video title");
	sendCommand("next video title");

	//Request video pause status on page load
	sendCommand("pause status");