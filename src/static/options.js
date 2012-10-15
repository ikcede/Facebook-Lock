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
  else	options = JSON.parse(options);
  
  if(!options["idle-time"]) {
	options["idle-time"] = "5";
  }
  $("#idle").val(options["idle-time"]);
  
  if(!options["passcode"]) {
	options["passcode"] = "b";
  }
  $("#passcode").val(options["passcode"]);
  localStorage["Facebook-Lock"] = JSON.stringify(options);  
}

$(document).ready(function() {
	restore_options();
	$("#save").click(function() {save_options();});
});
