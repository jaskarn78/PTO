
var db = firebase.firestore();
var data = JSON.parse(sessionStorage.getItem("userData"));
var user = data.userData;
var matchObj = {};
var winkId;
var winkData = [];
var openedWinkId;
var numOfWinks=0;

$(document).ready(function(){
	showLoader();
	$("#nameLink").text(user.name);
	$("#signOut").on("click", function(){ signOut(); })
	$("#closeWink").on("click", function(){ $("#modal1").modal('close');});
	$("#sendWink").hide();
	$("#deleteWink").hide();
	getMatches(user);
 	

});
function getMatches(myInfo){
	db.collection("users").where("userData.gender", "==", parseInt(myInfo.seeking))
	.where("userData.seeking", "==", parseInt(myInfo.gender)).limit(100)
		.get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	    	matchObj[doc.data().userData.uid.replace("-", "")] = doc.data();
	        populateMatches(doc.data());
	        populateChat(doc.data());
	        hideLoader();
	       
	    });
	    $(".user-more .wink").on("click", function(){
			$("#sendWink").show();
    		var user = matchObj[$(this).attr("id").replace("-", "")].userData;
    		$("#winkText").val('');
			winkId = $(this).attr("id").replace("-", "");
	   		$("#winkText").attr("disabled",false); 
	   		$("#winkText").css({"background":"white", "color":"black"});
	   		$("#winkText").addClass("center-align");

	   		$("#winkHeader").html('&nbsp;&nbsp;Send Wink To:<br><span style="font-size:14px;color:white" id="modalHeader"></span>');
			openModal(user.name, user.photoURL, '');



       });
	   $("#sendWink").on("click", function(){
	   		var winkText = $("#winkText").val();
	   		if(winkText=="") alert("Please type a proper message");
	   		else sendWink(winkText);
	   });
		loadRecievedWinks();
		$("#deleteWink").on("click", function(){
			deleteWink();
		});
		
		storeMatches(matchObj)

	});
}

function openModal(name, photo, text){
	$(".modal").modal();
	$('#modal1').modal('open');
	$(".modal").css({"max-height":"320px", "max-width":"400px"});
	$("#modalHeader").text(name);
	$("#winkImage").attr("src", photo);
	if(text!=="undefined")
		$("#winkText").text(text);
	
}

function clearTextArea(){
	$("#winkText").val('');
}

function loadRecievedWinks(){
	var winksRefToMe = firebase.database().ref('winks/'+user.uid+'/');
  	winksRefToMe.off();
  	var showToast = function(){
  		Materialize.toast('Wink Recieved!', 3000, 'rounded');
  	}
  	var setMessage = function(data){
    var val = data.val();
    displayMessage(data.key, val.fromId, val.name, val.text, val.photoUrl, val.imageUrl);
    winkData[data.key] = val;
    $("#badge").text(++numOfWinks);
  }.bind(this);
  	winksRefToMe.limitToLast(12).on('child_added', setMessage);
  	winksRefToMe.limitToLast(12).on('child_changed', setMessage);
  	winksRefToMe.limitToLast(1).on('child_added', showToast);
  	winksRefToMe.limitToLast(1).on('child_changed', showToast);

}

function displayMessage(key, fromId, name, text, photoUrl, imageUrl){
	if(key!=null || key!="undefined")
		//$("#navHeart").css({"animation-name":"pulse_animation","animation-duration":"4s","animation-iteration-count":"infinite"});
	$("#dropdown1").append('\
		<li id="winkList">\
			<a id="'+key+'" class="wink" onclick="openWink(this.id)" style="margin-top:10px;align:center">\
			<img src="'+photoUrl+'" style="margin-right:5px;width:30px;min-height:30px;height30px;border-radius:50%"/>'+name+'</a>\
		</li>');
}

function openWink(id){
	openedWinkId = id;
	//$("#sendWink").css({"display":"none"});
	//$("#deleteWink").css({"display":"block"});
	$("#sendWink").hide();
	$("#deleteWink").show();
	$("#winkText").val(winkData[id].text);
	$("#winkText").css({"background":"transparent", "color":"white", "border":"none"});
	$("#winkHeader").html('&nbsp;&nbsp;Wink Sent By:<br><span style="font-size:14px;color:white" id="modalHeader"></span>');
	$("#winkText").attr("disabled",true); 
	$('.modal').modal();
	openModal(winkData[id].name, winkData[id].photoUrl, winkData[id].text);
	return;
}


function sendWink(winkText){
	var winksFromMe = user.uid+"_"+winkId;
  	var winksRefFromMe = firebase.database().ref('winks/'+winkId+'/');
  	 winksRefFromMe.push({
      name: user.name,
      text: winkText,
      fromId: user.uid,
      photoUrl: user.photoURL || '/images/profile_placeholder.png'
    }).then(function(){
		$('#modal1').modal('close');
		$("#winkText").val('');
		Materialize.toast('Wink Sent!', 2000, 'rounded');
	});
}

function deleteWink(){
	//alert(openedWinkId);
	var deleteWinkRef = firebase.database().ref('winks/'+user.uid+'/'+openedWinkId+'/');
	deleteWinkRef.remove().then(function(){
		$("#"+openedWinkId).parent().remove();
		$('#modal1').modal('close');
    	$("#badge").text(--numOfWinks);
		Materialize.toast('Wink Removed!', 2000, 'rounded');
	});

}

function storeMatches(matchData){
	sessionStorage.setItem("matchData", JSON.stringify(matchObj));
}

function populateMatches(matchData){
	var userData = matchData.userData;
	if(userData.uid!==user.uid){
		$("#flex-grid").append('\
			<div class="palette" id="01"><div class="wrapper">\
				<div class="colors">\
					<div class="user">\
	        			<img src="'+userData.photoURL+'" alt="" class="circle responsive-img" style="width:90px; height:90px;"">\
	        			<p class="user-info">'+parseGender(userData.gender)+" "+getAgeFromDob(userData.birthday)+'</p>\
				        <p class="user-name">'+userData.name+'</p>\
				        <p class="user-location">'+userData.city+", "+userData.state+'</p>\
				    </div>\
	         		<div layout="row" class="user-more">\
	                	<a href="../member/member.html?match='+userData.uid.replace("-", "")+'">\
	                	<i class="small material-icons" id="person">person_outline</i></a>\
	                	<a data-target="modal1" style="background:none;border:none;border-shadow:none;cursor:pointer;cursor:hand;color:#FC747C" class="wink modal-trigger" id="'+userData.uid.replace("-", "")+'">\
	                	<i name="wink" class="small material-icons">favorite_border</i></a>\
	         		</div>\
	         	</div>\
	         </div>');
	}
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
	firebase.auth().signOut().then(function() {
		window.location.href='../signin';
	}, function(error) {
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
