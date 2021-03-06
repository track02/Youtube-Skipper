//On message received
browser.runtime.onMessage.addListener(request => {

	cmd = request.command;

	//Hook into player controls
	playpause = document.getElementsByClassName("ytp-play-button")[0];
	next = document.getElementsByClassName("ytp-next-button")[0];

	//Html5 video element
	video = document.getElementsByTagName("video")[0];	

	/*
	 * Command Parsing
	 */
	if (cmd === "play"){
		playpause.click();
	}
	else if(cmd === "pause status"){
		console.log("Received!");
		return Promise.resolve({value: video.paused});
	}
	else if (cmd === "time current"){
		return Promise.resolve({value: video.currentTime});
	}
	else if (cmd === "time total"){
		return Promise.resolve({value: video.duration});
	}
	else if (cmd === "adjust volume" && video){
			video.volume = parseFloat(request.parameter);
	}
	else if(cmd === "mute"){
			video.muted = !video.muted;
	}
	else if (cmd === "mute status"){
		return Promise.resolve({value: video.muted});
	}
	else if (cmd === "next video"){
		next.click();
	}
	else if (cmd === "video title"){
		title = (document.getElementsByTagName("title")[0]).innerHTML;
		return Promise.resolve({value: title}); 
	}
	else if (cmd === "next video title"){
		nextVideo = (document.getElementsByClassName("ytp-next-button")[0]).dataset.tooltipText;			
		return Promise.resolve({value: nextVideo});	
	}
	else if(cmd === "time skip f"){
		video.currentTime += parseInt(request.parameter);
	}
	else if(cmd === "time skip b"){
		video.currentTime -= parseInt(request.parameter);
	}
	else if(cmd == "restart"){
		video.currentTime = 0;
	}
	else{
		console.log("invalid command");
	}	
});