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
	$("#myImage").attr("src", myInfo.userData.photoURL);
}

function getMatchedUser(uid){
	$("#matchImage1").attr("src", "assets/img/person.png");
	$("#matched_img").attr("src", "assets/img/person.png");
	if(sessionStorage.getItem("matchData")==null){
		firebase.firestore().collection("users").doc(uid).get().then(function(doc){
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
	//var profile	 = matchData.profile;
	console.log(matchData);
	$("#matchImage1").attr("src", userInfo.photoURL);
	$("#matched_img").attr("src", userInfo.photoURL);
	$("#match_name").text(userInfo.name);
	$("#genderAge").text(parseGender(userInfo.gender)+", "+getAge(userInfo.birthday));
	$("addr").text(userInfo.city+", "+userInfo.state);
	$("#description").text(userInfo.description);
	//$("#school").text(profile.school);
	$("#ethnicity").text("Test");
	$("#languages").text("Test");
	$("#job_title").text("Test");
	//$("#drinker").text(parseDrinker(profile.drinker));
	$("#homeTown").text("Test, Test");
	if(userInfo.disability != null && userInfo.disability.showDisability){
		console.log(userInfo.disability);
		$("#disabilityItem").show();
		$("#disability").text(userInfo.disability.disability);
	} else $("#disabilityItem").hide();
	//$("#smoker").text(parseSmoker(profile.smoker));

}