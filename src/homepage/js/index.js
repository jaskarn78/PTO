
var db = firebase.firestore();
var myInfo = JSON.parse(sessionStorage.getItem("userData"));
var matchObj = {};
var blocked = {};
var blockId;
var myId = myInfo.userData.uid;

//variables for opening/sending "winks"
var winkId;
var winkData = [];
var openedWinkId;
var numOfWinks=0;

//variables for filtering results
var ageRange, activityLevel, hairColor, eyeColor;
var matchedUsers = [];
var hiddenUsers = [];
$(".modal").modal();

db.collection("users").doc(myId).onSnapshot(function(doc) {
	myInfo = doc.data();
	if(doc.data().blocked != null){
		blocked = doc.data().blocked;
		hideBlockedUsers(blocked);
	}
});

$(document).ready(function(){
	showLoader();
	setupAgeSlider();
	$("#nameLink").text(myInfo.userData.name);
	$("#signOut").on("click", function(){ signOut(); })
	$("#closeWink").on("click", function(){ $("#modal1").modal('close');});
	$("#sendWink").hide();
	$("#deleteWink").hide();
	getMatchesFromDb(myInfo.userData);
 	activityLevel = -1;hairColor = -1;eyeColor = -1;
});

function getMatchesFromDb(myInfo){
	db.collection("users").where("userData.gender", "==", parseInt(myInfo.seeking))
	.where("userData.seeking", "==", parseInt(myInfo.gender))
		.get().then(function(querySnapshot) {
    	querySnapshot.forEach(function(doc) {
    		if(blocked[doc.data().userData.uid] == null){
    			matchObj[doc.data().userData.uid] = doc.data();
        		populateMatches(doc.data());
    		}
       });

        hideLoader();
	    winks();
		storeMatches(matchObj);
		getMatchedUsersArray();
		setupFilters(matchedUsers);
		setupUserMenu(matchObj);
	});
}

	
function getMatchedUsersArray(){
	matchedUsers = $("#flex-grid").children();
	for(i=0; i<matchedUsers.length; i++){
		if(matchedUsers[i].attributes[6] != null)
			hiddenUsers[matchedUsers[i].attributes[6].value] = matchedUsers[i];
	}
}


function setupAgeSlider(){
	var slider = document.getElementById("age-slider");
	noUiSlider.create(slider, {
		start: [0, 100],
	    connect: true,
	    step: 1,
		tooltips: true,
		range: {'min': [18],'max': [90]},
		format: wNumb({ decimals: 0 })
	});
	ageRange = slider.noUiSlider.get();
}



function setupFilters(users){
	$('[name="activity"]').on("change", function(){
		activityLevel = $(this).val();
		applyFilters(users, ageRange, activityLevel, hairColor, eyeColor);
	});

	var slider = document.getElementById("age-slider");
	slider.noUiSlider.on('change', function(){
		ageRange = slider.noUiSlider.get();
		applyFilters(users, ageRange, activityLevel, hairColor, eyeColor);
	});

	$('[name="haircolor"]').on("change", function(){
		hairColor = $(this).val();
		applyFilters(users, ageRange, activityLevel, hairColor, eyeColor);
		
	})
	$('[name="eyecolor"]').on("change", function(){
		eyeColor = $(this).val();
		applyFilters(users, ageRange, activityLevel, hairColor, eyeColor);	
	})
}

function applyFilters(data, ageRange, activityLevel, hairColor, eyeColor){
	var minAge = ageRange[0];
	var maxAge = ageRange[1];
	for(i=0; i<data.length; i++){
		if(data[i].attributes[2] !=null && data[i].attributes[3] !=null && data[i].attributes[4] !=null && data[i].attributes[5] !=null 
			&& blocked[data[i].attributes[6].value] == null){
			var matchedUserAge = data[i].attributes[2].value;
			var matchedActivityLevel = data[i].attributes[3].value;
			var matchedHairColor = data[i].attributes[4].value;
			var matchedEyeColor = data[i].attributes[5].value;
			if((matchedUserAge > maxAge || matchedUserAge < minAge) || (activityLevel !=-1 && matchedActivityLevel != activityLevel)
				|| (hairColor != -1 && matchedHairColor != hairColor) || (eyeColor !=-1 && matchedEyeColor !=eyeColor))
				data[i].hidden = true;
			else data[i].hidden = false;
		}
	}

}

function populateMatches(matchData){
	var userData = matchData.userData;
	if(userData.uid!==myId){
		$("#flex-grid").append('\
			<div class="palette" id="users" data-age="'+getAgeFromDob(userData.birthday)+'" data-activity="'+userData.activity_level+'"\
			data-hairColor="'+userData.hair_color+'" data-eyeColor="'+userData.eye_color+'" data-uid="'+userData.uid+'">\
				<div class="wrapper" id="'+userData.uid+'">\
					<a id="'+userData.uid+'" class="right-align remove" style="color:red" href="#blockModal"><i class="small material-icons">close</i></a>\
					<div class="user">\
	        			<img src="'+userData.photoURL+'" alt="" class="circle responsive-img" style="width:85px; height:85px;"/>\
	        			<p class="user-info" style="margin-bottom:5px;" >'+parseGender(userData.gender)+" "+getAgeFromDob(userData.birthday)+'</p>\
				        <p class="user-name">'+userData.name+'</p>\
				        <p class="user-location" style="margin-bottom:5px;">'+userData.city+", "+userData.state+'</p>\
				    </div>\
	         		<div layout="row" class="center-align user-more" style="z-index:20 !important;"margin-bottom:25px;">\
	                	<a href="../member/member.html?match='+userData.uid+'">\
	                	<i class="small material-icons" id="person">person_outline</i></a>\
	                	<a data-target="modal1" style="margin-left:15px;margin-right:15px;background:none;border:none;border-shadow:none;cursor:pointer;cursor:hand;color:#FC747C" class="wink modal-trigger" id="'+userData.uid.replace("-", "")+'">\
	                	<i name="wink" class="small material-icons">favorite_border</i></a>\
				   		<a id="'+userData.uid+'" style="position:absolute;" class="dropdown-button usermenubtn" data-activates="usermenu" href="#"><i class="small material-icons">menu</i></a>\
	         		</div>\
	         	</div>\
	         </div>\
   			<ul id="usermenu"  style="position:absolute;z-index:20" class="dropdown-content">\
			    <li><a id="block" class="modal-trigger" href="#blockModal" style="font-size:14px;color:#FC747C">Block User</a></li>\
			    <li><a id="view" href="#!" style="font-size:14px;color:#FC747C">View Page</a></li>\
			    <li class="divider"></li>\
			    <li><a id="chat" href="#!" style="font-size:14px;color:#FC747C">Chat</a></li>\
	  </ul>');
	}
}


function displayMessage(key, fromId, name, text, photoUrl, imageUrl){
	if(key!=null || key!="undefined")
		$("#dropdown1").append('\
			<li id="winkList">\
				<a id="'+key+'" class="wink" onclick="openWink(this.id)" style="margin-top:10px;align:center">\
				<img src="'+photoUrl+'" style="margin-right:5px;width:30px;min-height:30px;height30px;border-radius:50%"/>'+name+'</a>\
			</li>');
}

function setupUserMenu(users){
	console.log(hiddenUsers);
	$('.dropdown-button').dropdown({inDuration: 300,outDuration: 225,constrainWidth: false, 
		hover: false, stopPropagation: false 
	});
	$(".remove").on("click", function(){
		blockId = $(this).attr("id");
		blockUser(blockId, users);

	});
}

function blockUser(uid, users){
	$("#blockModal").modal('open');
	var blockUserData = users[uid].userData;
	var blockUserName = blockUserData.name;
	
	$("#blockedUserName").html("Are you sure you want to block:<br>"+blockUserName+"<br><span style='font-size:11px;'>*User will be added to your blocked list.");
	$("#blockUserBtn").on("click", function(){
		  db.collection("users").doc(myId).set({"blocked":{[uid]: true}}, {"merge":true})
		  .then(function(){
			  db.collection("users").doc(uid).set({"blocked":{[myId]: true}}, {"merge":true})
			  .then(function(){
		  	 });
		});
	  	$("#blockedUserName").html("Successfully blocked user:<br>"+blockUserName);
		 setTimeout(closeModal, 500);

	});
}

function hideBlockedUsers(blocked){
	for(i=0; i<matchedUsers.length; i++){
		if(matchedUsers[i].attributes[6] != null){
			var user = matchedUsers[i].attributes[6].value;
			if(blocked[user] != null){
				matchedUsers[i].hidden = true;
			}

		}
	}
}


function closeModal(){
	$("#blockModal").modal('close')
}


function winks(){
	$(".user-more .wink").on("click", function(){
		$("#sendWink").show();
		$("#deleteWink").hide();
		var user = matchObj[$(this).attr("id")].userData;
		$("#winkText").val('');
		winkId = $(this).attr("id");
   		$("#winkText").attr("disabled",false); 
   		$("#winkText").css({"background":"white", "color":"black"});
   		$("#winkText").addClass("center-align");
   		$("#winkHeader").html('Send Wink To:<br><a onclick="goToProfile(winkId)" style="cursor:pointer;cursor:hand;"><span style="font-size:14px;color:white" id="modalHeader"></span></a>');
		openWinkModal(user.name, user.photoURL, '');
   });

	$("#sendWink").on("click", function(){
   		var winkText = $("#winkText").val();
   		if(winkText=="") alert("Please type a proper message");
   		else sendWink(winkText);
   });
	if(hiddenUsers[winkId]==null){
		loadRecievedData();
	}
	$("#deleteWink").on("click", function(){
		deleteWink();
	});
}

function openWink(id){
	openedWinkId = id;
	$("#sendWink").hide();
	$("#deleteWink").show();
	$("#winkText").val(winkData[id].text);
	$("#winkText").css({"background":"transparent", "color":"white", "border":"none"});
	$("#winkHeader").html('Wink Sent By:<br><a onclick="goToProfile(id)" \
		style="cursor:pointer;cursor:hand;style="font-size:14px;color:white;">\
		<span id="modalHeader" style="color:white;"></span></a>');
	$("#winkText").attr("disabled",true); 
	openWinkModal(winkData[id].name, winkData[id].photoUrl, winkData[id].text);
	return;
}

function openWinkModal(name, photo, text){
	$('#modal1').modal('open');
	$("#modal1").css({"max-height":"320px", "max-width":"420px"});
	$("#modalHeader").text(name);
	$("#winkImage").attr("src", photo);
	if(text!=="undefined")
		$("#winkText").text(text);
	
}

function clearTextArea(){
	$("#winkText").val('');
}

function loadRecievedData(){
	//$(".modal").modal();
	var winksRefToMe = firebase.database().ref('winks/'+myId+'/');
	var messages = firebase.database().ref().child("members").orderByChild("to").equalTo(myId);
	//members.once('value').then(function(snapshot){
		//if(snapshot.val()!=null)
	//});
  	winksRefToMe.off();
  	var showWinkToast = function(){
  		Materialize.toast('Wink Recieved!', 3000, 'rounded');
  	}
  	var showMsgToast = function(data){
  		Materialize.toast("Message Recieved!", 3000, 'rounded');
  	}
  	var setMsg = function(data){
  		var val = data.val();
  		var key = data.key;
    	//displayMessage(data.key, val.fromId, val.name, val.text, val.photoUrl, val.imageUrl);
  	}
  	var setWink = function(data){
  		var val = data.val();
    	displayMessage(data.key, val.fromId, val.name, val.text, val.photoUrl, val.imageUrl);
    	winkData[data.key] = val;
    	$("#badge").text(++numOfWinks);
  }.bind(this);
  	winksRefToMe.limitToLast(12).on('child_added', setWink);
  	winksRefToMe.limitToLast(12).on('child_changed', setWink);
  	winksRefToMe.limitToLast(1).on('child_added', showWinkToast);
  	winksRefToMe.limitToLast(1).on('child_changed', showWinkToast);
  	messages.limitToLast(1).on('child_added', showMsgToast);
  	messages.limitToLast(1).on('child_changed', showMsgToast);
  	//messages.limitToLast(1).on('child_added', setMsg);
  	//messages.limitToLast(1).on('child_changed', setMsg);


}


function sendWink(winkText){
	var winksFromMe = myId+"_"+winkId;
  	var winksRefFromMe = firebase.database().ref('winks/'+winkId+'/');
  	 winksRefFromMe.push({name: myInfo.userData.name,text: winkText,fromId: myId,
  	 	photoUrl: myInfo.userData.photoURL || '/images/profile_placeholder.png'
    }).then(function(){
		$('#modal1').modal('close');
		$("#winkText").val('');
		Materialize.toast('Wink Sent!', 2000, 'rounded');
	});
}

function deleteWink(){
	var deleteWinkRef = firebase.database().ref('winks/'+myId+'/'+openedWinkId+'/');
	deleteWinkRef.remove().then(function(){
		$("#"+openedWinkId).parent().remove();
		$('#modal1').modal('close');
    	$("#badge").text(--numOfWinks);
		Materialize.toast('Wink Removed!', 2000, 'rounded');
	});

}

function goToProfile(id){
	window.location.href='../member/member.html?match='+id;
}

function storeMatches(matchData){
	sessionStorage.setItem("matchData", JSON.stringify(matchObj));
}



function populateChat(matchData){
	$("#jd-chat .jd-body").append('<span class="jd-online_user" id="'+matchData.userData.uid+'">\
	<img class="circle" src="'+matchData.userData.photoURL+'" style="width:30px;height:30px;margin-right:5px;"/>\
	'+matchData.userData.name+'<i class="light">&#8226;</i><hr></span>');
}

function getAgeFromDob(bday){
	var ageDiffMs = Date.now() - (new Date(bday)).getTime();
	var ageDate = new Date(ageDiffMs);
	return Math.abs(ageDate.getUTCFullYear()-1970);
}

function parseGender(genderVal){
	var genderArr = ["Male (Cis)", "Male (Trans)","Genderqueer", "Female (Cis)", "Female (Trans)", "Genderqueer","Intersex", "Agender"];
	return genderArr[genderVal];
}
function signOut(){
	firebase.auth().signOut().then(function(result) {
		sessionStorage.clear();
		localStorage.clear();
		window.location.href='../signin';
	}).catch(function(error) {
		console.error('Sign Out Error', error);
	});
}

function massLoad(){
	$.getJSON("../php/user.json", function(data){
		$.each(data, function(key, val){
			var user = val;
				db.collection("users").doc(user.uid.replace("-", "")).set({
					userData : {"name":user.name, "email":user.email, "photoURL":user.photoURL, 
					"birthday":user.birthday,"description":user.description, "city":user.city, 
					"country":user.country,"state":user.state,"zip":user.zip,
					"lat":user.lat,"lng":user.lng,"uid":user.uid, "gender":user.gender,"seeking":user.seeking},
					profile: {"drinker":user.drinker, "ed_level":user.ed_level, "ethnicity":user.ethnicity, "ethnicity_importance":user.ethnicity_importance,
						  "family_importance":user.family_importance, "fin_stable":user.fin_stable, "have_kids":user.have_kids, "home_city":user.home_city,
							"home_country":user.home_country, "home_state":user.home_state, "job_company":user.job_company, "job_title":user.job_title,
							"languages":user.languages, "marital_status":user.marital_status, "political_view":user.political_view, "religion":user.religion,
							"school":user.school, "sex_importance":user.sex_importance, "smoker":user.smoker, "stability_importance":user.stability_importance,
						    "start_family":user.start_family, "subject":user.subject}
				}).catch(function(error){
					alert(error.message);
				});
		});
	});
}
