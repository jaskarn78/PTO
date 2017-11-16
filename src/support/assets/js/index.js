var user;
var ticketIds = [];
$(document).ready(function(){
	$("#signOutBtn").on("click", function(){ signOut(); });
	user = JSON.parse(sessionStorage.getItem("userData"));
	getOpenTickets();
	fillKnownFields(user);
});

function fillKnownFields(data){
	var userInfo = data.userData;
	$("#name").val(userInfo.name);
	$("#email").val(userInfo.email);
	$("#submitTicket").on("click", submitTicket);
}



function submitTicket(){
	showLoader();
	var api_key = "LCIyzYfk2Qk9u6qsbD7T";
	var userDbLink = "https://console.firebase.google.com/project/ptoapp-90ad1/database/firestore/data~2Fusers~2F"+user.userData.uid;
	var cc_emails = [user.userData.email];
	var timestamp = new Date(1382086394000);
	var description ='<div>User Name: '+$("#name").val()+'</div>'+
	    '<div>User Id:<a href="'+userDbLink+'">'+user.userData.uid+'</div>'+
	    '<div>Email: '+$("#email").val()+'</div>'+
	    '<div>Description: '+$("#description").val()+'</div>'+
	    '<div>Timestamp:'+timestamp.toString().substring(0, 21)+'</div>';

    var formdata = new FormData();
    formdata.append('description', description);
    formdata.append('email', $("#email").val());
    formdata.append('subject', $("#subject").val());
    formdata.append('priority', '2');
    formdata.append('status', '2');

    if($("#attachment")[0] != null)
    	formdata.append('attachments[]', $("#attachment")[0].files[0]);

    $.ajax({
        url: "https://ptosupportpage.freshdesk.com/api/v2/tickets",
        type: 'POST',
        contentType: false,
        processData: false,
        headers: {"Authorization": "Basic " + btoa(api_key + ":x")},
        data: formdata,
        success: function(data, textStatus, jqXHR) {
          console.log(data.id);
          hideLoader();
  		  Materialize.toast('Ticket Submitted', 3000, 'rounded');
  		  storeTicketInDb(data);
        }
        
      });
 
}

function getOpenTickets(){
	var ticketRef = firebase.database().ref('support/tickets/'+user.userData.uid+'/');
	var setTicketData = function(data){
  		var val = data.val();
  		displayTicket(val.id, val.created_at);
  }.bind(this);
  	ticketRef.limitToLast(12).on('child_added', setTicketData);
  	ticketRef.limitToLast(12).on('child_changed', setTicketData);

}

function displayTicket(id, createdAt){
	$("#openTickets").append('\
		 <div class="center-align col s4">'+id+'</div>\
         <div class="right-align col s8">'+createdAt.substring(0, 10)+'</div>'
	);
}

function storeTicketInDb(data){
	var ticketRef = firebase.database().ref('support/tickets/'+user.userData.uid+'/');
	ticketRef.set({"ticket":data}).then(function(){
		console.log("Ticket: "+data.id+" saved")
	});

}

