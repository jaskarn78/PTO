$("document").ready(function(){
    $('select').material_select();
    $("#finishBtn").click(saveUserData);
});

function getUserInput(){
	var userData      	  =
	
	console.log(userData);
	saveUserData(userData);
}

function saveUserData(){
	var userData = JSON.parse(sessionStorage.getItem("userData"));
	userData.gender       = parseInt($("#gender").val());
	userData.seeking      = parseInt($("#seeking").val());	
	userData.acctType	  = parseInt($("acctType").val());
	userData.description  = callFbApi(userData);
	sessionStorage.setItem("userData", JSON.stringify(userData));
	console.log(userData);
	goToNext();
}

function callFbApi(result){
	var description = '';
	if(result.credential != null){
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