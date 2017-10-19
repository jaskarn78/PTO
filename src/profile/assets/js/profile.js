 var config = {
        apiKey: "AIzaSyD657gqCD1kkqRTmrqy0mIbw9gpfiOKyQg",
        authDomain: "dkweb-176823.firebaseapp.com",
        databaseURL: "https://dkweb-176823.firebaseio.com",
        projectId: "dkweb-176823",
        storageBucket: "dkweb-176823.appspot.com",
        messagingSenderId: "412591321120"
 };

$(document).ready(function(){
	firebase.initializeApp(config);
 if(sessionStorage.getItem("userInfo")!==null){
 	var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
	if(typeof(userInfo.fbData)!=="undefined"){
		$("#fbBtn").text('CONNECTED');
        $("#fbBtn").css({"background-color":"#FF778A","color":"white"});
        
	}
	
	if(typeof(userInfo.twitterData)!=="undefined"){
		$("#twitterBtn").text('CONNECTED');
        $("#twitterBtn").css({"background-color":"#FF778A","color":"white"});
       
	}
}

	
  
	$("#fbBtn").click(function(){ 
		connectFB(); 
	});
	$("#twitterBtn").click(function(){ 
		connectTwitter(); 
	});
	$("#igBtn").click(function(){ connectIG(); });
	$("#fbLogin").click(function(){
		signInFB();
		userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

	});
	$("#signOut").click(function(){
		if(confirm('Are you sure you want to sign out?')==true){
			firebase.auth().signOut().then(function(){
					sessionStorage.clear();
			}).catch(function(error){
				alert(error);
			});
		}
	});

});



function connectFB(){
	var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
	var provider = new firebase.auth.FacebookAuthProvider();
	provider.setCustomParameters({'display': 'popup'});
	firebase.auth().signInWithPopup(provider).then(function(result){
		var profile = result.additionalUserInfo.profile;
		var fbDataObj = {};
		userInfo.fbData = getFbData(fbDataObj, result);
		if(userInfo.login_type!=="1"){
			if(typeof(userInfo.twitterData) == "undefined")
				$("#image2").attr("src", decodeURIComponent(userInfo.fbData.profile_img));
			else $("#image3").attr("src", decodeURIComponent(userInfo.fbData.profile_img));

		}
		$("#fbBtn").text('CONNECTED');
        $("#fbBtn").css({"background-color":"#FF778A","color":"white"}); 

		sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
    });


}

function signInFB(){
	if(sessionStorage.getItem("userInfo")!=null)
		var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
	else var userInfo = {};
	var provider = new firebase.auth.FacebookAuthProvider();
	provider.setCustomParameters({'display': 'popup'});
	firebase.auth().signInWithPopup(provider).then(function(result){
  		proceed(getFbData(userInfo, result));
    });
}

function connectTwitter(){
	var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
	var provider = new firebase.auth.TwitterAuthProvider();
	provider.setCustomParameters({'display': 'popup'});
	var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
	firebase.auth().signInWithPopup(provider).then(function(result){
		userInfo.twitterData = result;
		var twitterImage = decodeURIComponent(result.user.photoURL).replace("_normal", "");
		if(typeof(userInfo.fbData) == "undefined")
			$("#image2").attr("src", twitterImage);
		else $("#image3").attr("src",twitterImage);
		sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        $("#twitterBtn").text('CONNECTED');
        $("#twitterBtn").css({"background-color":"#FF778A","color":"white"});
    });
}

function connectIG(){
	var client_id = '5beff70bc6514985a5e308c7950d8a79';
	var redirect_uri = 'https://jagpal-development.com/php/util/instagram.php';
	var url = ('https://api.instagram.com/oauth/authorize/?client_id='+client_id+'&redirect_uri='+redirect_uri+'&response_type=token');
	window.location.href=url;

}

function getFbData(fbObject, result){
	var response		   = result.additionalUserInfo.profile;
	fbObject.email    	   = response.email;
	fbObject.first_name    = response.first_name;
	fbObject.last_name 	   = response.last_name;
	fbObject.profile_img   = encodeURIComponent(response.picture.data.url);
	fbObject.pw 		   = response.id;
	fbObject.link 		   = encodeURIComponent(response.link);
	fbObject.dob 		   = response.birthday;
	fbObject.addr 	       = response.location;
	fbObject.login_type    = 1;
	fbObject.accessTokenFb = result.credential.accessToken;
	return fbObject;

}


function proceed(userInfo){
 	var url = "https://graph.facebook.com/v2.10/me?fields=about";
 	$.ajax({
 		url: url,
 		type: 'GET',
 		data: "access_token="+userInfo.accessTokenFb,
 		dataType: "json",
 		success:function(data){
 			if(typeof(data.about)!=="undefined"){
 				userInfo.description = data.about;
 				sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
 			}

 		}
 	});

	$.ajax({
		url:'../../util/VerifyExisting.php',
        type:'POST',
        data:'fbSignIn=true&userInfo='+JSON.stringify(userInfo),
        dataType:'JSON',
        success:function(data){
        	var output = data.output;
        	if(output.insertId!=="undefined"){
        		userInfo.user_id 	 = output.insertId;
        		userInfo.email_key 	 = output.email_key;
        		sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        		window.location.href="../../setup/basicinfo/";
        	}else{
        		var userData 	    = output.userInfo;
        		userData.languages  = output.lang;
			    userData.genderVal  = userData.gender;
			    userData.desc 		= userInfo.description;
        		sessionStorage.setItem("userInfo", JSON.stringify(userData));
        		window.location.href="../profile";
        	}
        }
     });
}
