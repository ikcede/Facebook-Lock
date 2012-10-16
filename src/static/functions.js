
function activate() {
	$("#activate").css("background","-webkit-gradient(linear, left top, left bottom, from(#BEFFBE), to(#69FF69))");
	$("#stop").css("background","-webkit-gradient(linear, left top, left bottom, from(#FF3F3F), to(#FF5959))");
	
	var str = JSON.parse(localStorage["Facebook-Lock"]);
	if(str["activated"]=="false") {
	
		str["activated"]="true";
		localStorage["Facebook-Lock"] = JSON.stringify(str);
		
		// Change icon
		chrome.browserAction.setIcon({path:"static/lock.png"});
	}

}

function stop() {
	
	var str = JSON.parse(localStorage["Facebook-Lock"]);
	if(str["activated"]=="true") {
	
		$("#activate").css("background","-webkit-gradient(linear, left top, left bottom, from(#4BE94B), to(#48C548))");
		$("#stop").css("background","-webkit-gradient(linear, left top, left bottom, from(#FFB5B5), to(#FF9494))");
	
		str["activated"]="false";
		localStorage["Facebook-Lock"] = JSON.stringify(str);
		
		// change icon
		chrome.browserAction.setIcon({path:"static/unlock.png"});
	}

}

function initButtons() {

	$('#activate').click(function() {activate();});
	$('#stop').click(function() {stop();});
	
	var str = localStorage["Facebook-Lock"];
	
	// Define value
	if(typeof str == 'undefined') {
		str = {activated:"false"};
		localStorage["Facebook-Lock"] = JSON.stringify(str);
	}
	
	else {
		str = JSON.parse(str);
		if(!str["activated"]) {str["activated"]="false";localStorage["Facebook-Lock"] = JSON.stringify(str);}
		if(str["activated"]=="true") {
			$("#activate").css("background","-webkit-gradient(linear, left top, left bottom, from(#BEFFBE), to(#69FF69))");
			$("#stop").css("background","-webkit-gradient(linear, left top, left bottom, from(#FF3F3F), to(#FF5959))");
			chrome.browserAction.setIcon({path:"static/lock.png"});
		}
	}
	
}

$(document).ready(function() {
	initButtons();
});