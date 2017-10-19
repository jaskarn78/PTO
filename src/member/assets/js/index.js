
var db = firebase.firestore();
$(document).ready(function(){
	showLoader();
	setupMyInfo();
	var matchId = getMatchId();
	getMatchedUser(matchId);
});


function getMatchId(url){
	var url = window.location.href;
	var urlParams = {};
  	url.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { urlParams[$1] = $3; } );
  return urlParams.match;
}

function setupMyInfo(){
	var myInfo = JSON.parse(sessionStorage.getItem("userData"));
	console.log(myInfo.userData.photoURL);
	$("#myImage").attr("src", myInfo.userData.photoURL);
}

function getMatchedUser(uid){
	$("#matchImage1").attr("src", "assets/img/person.png");
	$("#matched_img").attr("src", "assets/img/person.png");
	if(sessionStorage.getItem("matchData")==null){
		db.collection("users").doc(uid).get().then(function(doc){
			if(doc.exists){
				hideLoader();
				var matchData = doc.data();
				assignMatchInfo(matchData);
			}
		});
	} else {
		var matchData = JSON.parse(sessionStorage.getItem("matchData"));
		assignMatchInfo(matchData[uid]);
		hideLoader();
	}
}

function assignMatchInfo(matchData){
	var userInfo = matchData.userData;
	var profile	 = matchData.profile;
	console.log(matchData);
	$("#matchImage1").attr("src", userInfo.photoURL);
	$("#matched_img").attr("src", userInfo.photoURL);
	$("#match_name").text(userInfo.name);
	$("#genderAge").text(parseGender(userInfo.gender)+", "+getAge(userInfo.birthday));
	$("addr").text(userInfo.city+", "+userInfo.state);
	$("#description").text(userInfo.description);
	$("#school").text(profile.school);
	$("#ethnicity").text(profile.ethnicity);
	$("#languages").text(profile.languages);
	$("#job_title").text(profile.job_title);
	$("#drinker").text(parseDrinker(profile.drinker));
	$("#homeTown").text(profile.home_city+", "+profile.home_state);
	$("#smoker").text(parseSmoker(profile.smoker));

}