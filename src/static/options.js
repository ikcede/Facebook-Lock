// Saves options to localStorage.
function save_options() {
  
  var toStore = JSON.parse(localStorage["Facebook-Lock"]);
  
  // Set options
  if($("#idle").val()!="") {
	toStore["idle-time"] = $("#idle").val();
  }
  else $("#idle").val(options["idle-time"]);
  
  if($("#passcode").val()!="") {
	toStore["passcode"] = $("#passcode").val();
  }
  else $("#passcode").val(options["passcode"]);
  
  localStorage["Facebook-Lock"] = JSON.stringify(toStore);

  // Update status to let user know options were saved.
  $("#status").html(" Options saved. ")
  
  setTimeout(function() {
    $("#status").html("");
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var options = localStorage["Facebook-Lock"];
  if (!options) {
    options = {};
  }
  else options = JSON.parse(options);
  
  if(!options["idle-time"]) {
	options["idle-time"] = "5";
  }
  $("#idle").val(options["idle-time"]);
  $("#presets").val(checkSecurityLevel(options["idle-time"]));
  
  if(!options["passcode"]) {
	options["passcode"] = "b";
  }
  $("#passcode").val(options["passcode"]);
  localStorage["Facebook-Lock"] = JSON.stringify(options);  
}

function checkLock() {
	var str = localStorage["Facebook-Lock"];
	if(!str) return; // Never activated
	
	str = JSON.parse(str);
	
	if(str["locked"] && str["locked"] == "true") {
		
		if(str["fb-cookie"] && str["fb-cookie"] == "false") {
			str["locked"] = "false";
			localStorage["Facebook-Lock"] = JSON.stringify(str);
			return;
		}
		
		var test = prompt("Settings are locked. Enter the current passphrase to unlock:");
		
		if(test != str["passcode"]) {
			str["locked"] = "false";
			
			// Get rid of the cookie
			str["cookie"] = "";
			localStorage["Facebook-Lock"] = JSON.stringify(str);
		}
		
	}
}

function setSecurityLevel(preset) {
	if(preset=="paranoid") {$("#idle").val(.25);}
	if(preset=="default-(lax)") {$("#idle").val(5);}
	if(preset=="normal") {$("#idle").val(3);}
	if(preset=="high") {$("#idle").val(1);}
}

function checkSecurityLevel(number) {
	if(number==.25) {return "paranoid";}
	if(number==1) {return "high";}
	if(number==3) {return "normal";}
	if(number==5) {return "default-(lax)";}
	return "custom";
}

$(document).ready(function() {
	checkLock();
	restore_options();
	$("#save").click(function() {save_options();});
	
	$("#presets").mouseout(function() {
		setSecurityLevel($(this).val());
	});
	
});
