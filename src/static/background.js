// Background.js
// Runs the idle listener and most of the main scripts

// Add listeners
chrome.tabs.onUpdated.addListener(function(tabId, something, tab) {

	var str = localStorage["Facebook-Lock"];
	if(!str) return; // Never activated
	
	str = JSON.parse(str);
	
	if(str["locked"] && str["locked"] == "true" && tab.url.indexOf("facebook.com") != -1 && something.status=="complete") {
		
		if(str["fb-cookie"] && str["fb-cookie"] == "false") {
			str["locked"] = "false";
			localStorage["Facebook-Lock"] = JSON.stringify(str);
			return;
		}
		
		var test = prompt("Facebook is locked. Unlock it (and remember to turn off the lock later):");
		
		if(test == str["passcode"]) {
			str["locked"] = "false";
			
			removeAllCookies(".facebook.com");
			
			// Return the facebook cookies
			for(var i = 0;i<str["cookie"].length;i++) {
				setChromeCookie(str["cookie"][i]);
			}
			
			str["cookie"] = "";
			
			str = logAttempt(true,str);
			
			localStorage["Facebook-Lock"] = JSON.stringify(str);
			
			chrome.tabs.reload(tabId);
		
		}
		
		// Answered wrong
		else {
			str["locked"] = "false";
			
			// Get rid of the cookie
			str["cookie"] = "";
			
			str = logAttempt(false,str);
			
			localStorage["Facebook-Lock"] = JSON.stringify(str);
			
			// Open splash window
			chrome.windows.create({
				'url': 'splash.html', 
				'type': 'popup', 
				width:500,
				height:275, 
				top:150, 
				left:400
			});
		}
		
	}

});

// Helper function for logging attempts
function logAttempt(success, str) {

	// Init logs
	var logs;
	if(typeof str["logs"] == "undefined" || !str["logs"]) {logs=[];}
	else {logs = str["logs"];}
	
	var date = new Date();
	
	var temp = "Attempt on " + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() +
		" <br>at " + date.getHours() + ":";
	
	// Minute formatting
	if(Number(date.getMinutes())<10) {temp+="0"+date.getMinutes() + ":";;}
	else {temp+=date.getMinutes() + ":";}
	
	// Second formatting
	if(Number(date.getSeconds())<10) {temp+="0"+date.getSeconds() + ".<br>";}
	else {temp+=date.getSeconds() + ". ";}
	
	temp += success ? "<b>Success.</b>" : "<b>Failure.</b>";
	
	logs.push(temp);
		
	str["logs"] = logs;
	
	return str;
}

// Helper function to set cookies
function setChromeCookie(cookie) {
	if(cookie.session) {
			
		chrome.cookies.set({
			domain:".facebook.com",
			name:cookie.name,
			url:"http://www.facebook.com/",
			storeId:cookie.storeId,
			value:cookie.value,
			path:"/",
			httpOnly:cookie.httpOnly,
			secure:cookie.secure
		});
	
	}
	
	else {
		
		chrome.cookies.set({
			domain:".facebook.com",
			name:cookie.name,
			url:"http://www.facebook.com/",
			storeId:cookie.storeId,
			value:cookie.value,
			expirationDate:cookie.expirationDate,
			path:"/",
			httpOnly:cookie.httpOnly,
			secure:cookie.secure
		});
		
	}
			
}

function removeAllCookies(c_domain) {
	chrome.cookies.getAll({domain:c_domain},function(a_cookies) {
		for(var i=0;i<a_cookies.length;i++) {
			chrome.cookies.remove({name:a_cookies[i].name,url:"http://www"+c_domain+"/"});
		}
	});
}

// Checks the idle state
function checkState() {
	
	var str = localStorage["Facebook-Lock"];
	if(!str) return; // Never activated
	
	str = JSON.parse(str);
	
	if(str["locked"] && str["locked"] == "true") {return;} // Because we don't care anymore now
	
	if(!str["idle-time"]) str["idle-time"] = "5";
	
	if(str["activated"] === "true") {
		
		// When checked, set the lock picture
		chrome.browserAction.setIcon({path:"static/lock.png"});
		
		// Minimum 15
		chrome.idle.queryState(Number(str["idle-time"])*60, function(state) { // Because it's in seconds
			if(state=="idle") {
			
				// alert("locked"); // Testing purposes
				
				// Steal the Facebook cookie
				chrome.cookies.getAll({domain:".facebook.com",name:"c_user"},function(a_cookies) {
					if(typeof a_cookies[0] == 'undefined' || !a_cookies[0]) {
						str["fb-cookie"]="false";
						str["locked"] = "true";
						localStorage["Facebook-Lock"] = JSON.stringify(str);
						return;
					}
					str["fb-cookie"]="true";
					str["locked"] = "true";
					localStorage["Facebook-Lock"] = JSON.stringify(str);
					
				});
				
				chrome.cookies.getAll({domain:".facebook.com"},function(b_cookies) {
					
					str["cookie"] = b_cookies;
					localStorage["Facebook-Lock"] = JSON.stringify(str);
				
					for(var i=0;i<b_cookies.length;i++) {
						// Remove
						chrome.cookies.remove({name:b_cookies[i].name,url:"http://www.facebook.com/"});
					}
				});

			}
		});
	
	}
}

checkState();
setInterval(function() {checkState()}, 5000);