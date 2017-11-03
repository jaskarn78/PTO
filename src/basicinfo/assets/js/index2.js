$("document").ready(function(){
    $('select').material_select();
    $("#finishBtn").on("click", getUserInput);
});

function getUserInput(){
	var userData      ={};
	userData.gender       = parseInt($("#gender").val());
	userData.seeking      = parseInt($("#seeking").val());	
	userData.acctType	  = parseInt($("acctType").val());
	console.log(userData);
	saveUserData(userData);
}

function saveUserData(userData){
	var data = JSON.parse(sessionStorage.getItem("userData"));
	data.userData = userData;
	sessionStorage.setItem("userData", JSON.stringify(userData));
	console.log(userData);
	//goToNext();
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

function goToNext(){
	window.location.href="../welcome";
}