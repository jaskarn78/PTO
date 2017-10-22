
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
	//$("#nameLink").text(user.name);
	getMatches(user);
	//console.log(JSON.parse(sessionStorage.getItem("matchData")));

});
function getMatches(myInfo){
	db.collection("users").where("userData.gender", "==", parseInt(myInfo.seeking)).where("userData.seeking", "==", parseInt(myInfo.gender)).limit(100)
		.get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	    	console.log(doc.data());
	    	matchObj[doc.data().userData.uid.replace("-", "")] = doc.data();
			//storeMatches(doc.data());
	        populateMatches(doc.data());
	        //populateChat(doc.data());
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
	$("#profile").append('<div class="col-md-4">\
          <div class="card card-profile">\
            <div class="card-avatar">\
              <a href="../member/member.html?match='+userData.uid.replace("-", "")+'">\
                <img class="img" src="'+userData.photoURL+'" />\
              </a>\
            </div>\
            <div class="card-content">\
              <h4 class="card-title">'+userData.name+'</h4>\
              <h6 class="category text-muted">'+parseGender(userData.gender)+", "+getAgeFromDob(userData.birthday)+'</h6>\
              <div class="footer">\
                <a href="#pablo" id="'+userData.uid+' "class="btn btn-just-icon btn-linkedin btn-round"><i class="fa fa-linkedin"></i></a>\
                <a href="#pablo" class="btn btn-just-icon btn-twitter btn-round"><i class="fa fa-twitter"></i></a>\
                <a href="#pablo" class="btn btn-just-icon btn-dribbble btn-round"><i class="fa fa-dribbble"></i></a>\
              </div>\
            </div>\
          </div>\
        </div>');
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
