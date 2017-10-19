$(document).ready(function(){
	var data = JSON.parse(sessionStorage.getItem('userData'));
	$("#nextBtn").click(function(){
		getData(data);
	});
});

function getData(user){
	var profile = user.profile;
	profile.smoker 				 = $("#smoker").val();
	profile.drinker 			 = $("#drinker").val();
	profile.start_family 		 = $("#start_family").val();
	profile.religion_importance  = $("#religion_importance").val();
	profile.edLevel_importance 	 = $("#edLevel_importance").val();
	profile.sex_importance 		 = $("#sex_importance").val();
	profile.stability_importance = $("#stability_importance").val();
	profile.poltiical_importance = $("#poltiical_importance").val();
	profile.family_importance 	 = $("#family_importance").val();
	profile.ethnicity_importance = $("#ethnicity_importance").val();
	saveData(user);
}
function saveData(user){
	sessionStorage.setItem('userData', JSON.stringify(user));
	goToNext();
}
function goToNext(){
	window.location.href='social.html';
}