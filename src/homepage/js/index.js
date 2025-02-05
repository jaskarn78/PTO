
var config = {
	apiKey: "AIzaSyDXjq1Or10iD_J229t3qxyWxskmDBxjJ3s",
	authDomain: "ptoapp-90ad1.firebaseapp.com",
	databaseURL: "https://ptoapp-90ad1.firebaseio.com",
	projectId: "ptoapp-90ad1",
	storageBucket: "ptoapp-90ad1.appspot.com",
	messagingSenderId: "101372763303"
};
firebase.initializeApp(config);
var db = firebase.firestore();
var data = JSON.parse(sessionStorage.getItem("userData"));
var user = data.userData;
var matchObj = {};

$(document).ready(function(){
	showLoader();
	$("#nameLink").text(user.name);
	getMatches(user);
	console.log(JSON.parse(sessionStorage.getItem("matchData")));

});
function getMatches(myInfo){
	db.collection("users").where("userData.gender", "==", parseInt(myInfo.seeking)).where("userData.seeking", "==", parseInt(myInfo.gender)).limit(100)
		.get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	    	console.log(doc.data());
	    	matchObj[doc.data().userData.uid.replace("-", "")] = doc.data();
			//storeMatches(doc.data());
	        populateMatches(doc.data());
	        populateChat(doc.data());
	        hideLoader();
	    });
	    storeMatches(matchObj)

	});

}

function storeMatches(matchData){
	sessionStorage.setItem("matchData", JSON.stringify(matchObj));
}

function populateMatches(matchData){
	var userData = matchData.userData;
	$("#flex-grid").append('<div class="palette" id="01"><div class="wrapper"><div class="colors"><div class="user">\
        <img src="'+userData.photoURL+'" alt="" class="circle responsive-img" style="width:90px; height:90px;"">\
        <p class="user-info">'+parseGender(userData.gender)+" "+getAgeFromDob(userData.birthday)+'</p>\
        <p class="user-name">'+userData.name+'</p>\
        <p class="user-location">'+userData.city+", "+userData.state+'</p></div>\
         <div layout="row" class="user-more">\
                <a href="../member/member.html?match='+userData.uid.replace("-", "")+'">\
                <i class="small material-icons" id="person">person_outline</i></a>\
                <i class="small material-icons" id="wink">mood</i></div></div></div></div>');
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
