$(document).ready(function(){
	var data = JSON.parse(sessionStorage.getItem('userData'));
	$("#nextBtn").click(function(){
		getData(data);
	});
});

function getData(user){
	var profile = {};
	profile.marital_status = $("#marital_status").val();
	profile.have_kids 		= $("#have_kids").val();
	profile.ed_level 		= $("#education_level").val();
	profile.subject 		= $("#subject").val();
	profile.school 		= $("#school").val();
	profile.job_title 		= $("#job_title").val();
	profile.job_company 	= $("#job_company").val();
	profile.fin_stable 	= $("#fin_stable").val();
	profile.political_view = $("#political_view").val();
	profile.ethnicity 		= $("#ethnicity").val();
	profile.religion 		= $("#religion").val();
	profile.home_country 	= $("#home_country").val();
	profile.home_state		= $("#home_state").val();
	profile.home_city		= $("#home_city").val();
	profile.languages 		= $("#languages").val();
	profile.gender  		= user.genderVal;
	profile.seeking 		= user.seeking;
	user.profile 			= profile;
	saveData(user);
}

function saveData(user){
	sessionStorage.setItem('userData', JSON.stringify(user));
	goToNext();
}

function goToNext(){
	window.location.href='overview2';
}
