
var config = {
	apiKey: "AIzaSyDXjq1Or10iD_J229t3qxyWxskmDBxjJ3s",
	authDomain: "ptoapp-90ad1.firebaseapp.com",
	databaseURL: "https://ptoapp-90ad1.firebaseio.com",
	projectId: "ptoapp-90ad1",
	storageBucket: "ptoapp-90ad1.appspot.com",
	messagingSenderId: "101372763303"
};
firebase.initializeApp(config);

$(document).ready(function(){
	var data = {};
	if(typeof(sessionStorage.getItem('userData')!=="undefined")){
		data = JSON.parse(sessionStorage.getItem('userData'));
		checkBirthday(data);
	};

	$("#basicInfoBtn").click(function(){
		getBasicInfo(data);
	});
	
});

function checkBirthday(data){
	if(typeof(data.additionalUserInfo)!=="undefined" ){
		if(typeof(data.additionalUserInfo.profile.birthday)!=="undefined"){
			var bday = data.additionalUserInfo.profile.birthday;
			$("#dob").attr("value", new Date(bday).toISOString().substr(0, 10));
		}
	}
}


function getBasicInfo(data){
	var userData      ={};
	userData.genderVal    = $("#gender").val();
	userData.seeking      = $("#seeking").val();
	userData.bday         = $("#dob").val();
	userData.zip          = $("#zip").val();
	userData.age 		  = getAgeFromDob(userData.bday);
	userData.locationData = getLocationFromZip(userData.zip);
	userData.description  = callFbApi(data);
	if(typeof(data.uid)!=='undefined'){
		userData.uid = data.uid;
		userData.email = data.email;
		userData.emailVerified = data.emailVerified;
		userData.providerData  = data.providerData;
	}

	else{
		userData.uid 		  = data.user.uid;
		userData.access_token  = data.credential.accessToken;
		userData.emailVerified = data.user.emailVerified;
		userData.photoURL      = data.user.photoURL;
		userData.name 		   = data.user.displayName;	
		userData.email 		   = data.user.email;
		userData.providerData 	   = data.user.providerData[0];
	}
	var user = {"userData":userData}; 
	saveUserData(user);
}

function getLocationFromZip(zip){
	var Httpreq = new XMLHttpRequest(); // a new request
    if(zip.length==5 && zip.match(/^[0-9]+$/)){   
        var url="https://maps.googleapis.com/maps/api/geocode/json?address="+zip+"&sensor=true";
        Httpreq.open("GET",url, false);
        Httpreq.send(null);
        var jsonObj      = JSON.parse(Httpreq.responseText);
        var locationData = {};
        locationData.zip     = zip;
        locationData.city    = jsonObj.results[0].address_components[1].long_name;
        locationData.state   = jsonObj.results[0].address_components[3].short_name;
        locationData.country = jsonObj.results[0].address_components[4].short_name;
        locationData.lat     = jsonObj.results[0].geometry.location.lat;
        locationData.lng     = jsonObj.results[0].geometry.location.lng;
        return locationData;
   }
}

function getAgeFromDob(bday){
	var ageDiffMs = Date.now() - (new Date(bday)).getTime();
	var ageDate = new Date(ageDiffMs);
	return Math.abs(ageDate.getUTCFullYear()-1970);
}

function saveUserData(data){
	sessionStorage.setItem('userData', JSON.stringify(data));
	goToNext();
}

function goToNext(){
	window.location.href='../welcome';
}

function callFbApi(result){
	var description = '';
	if(typeof(result.credential)!=="undefined"){
		var url = "https://graph.facebook.com/v2.10/me?fields=about";
	 	$.ajax({
	 		async: false,
	 		url: url,
	 		type: 'GET',
	 		data: "access_token="+result.credential.accessToken,
	 		dataType: "json",
	 		success:function(data){
	 			if(typeof(data.about)!=='undefined')
	 				description = data.about;
	 		}
	 	});
	 }
	 return description;
}
