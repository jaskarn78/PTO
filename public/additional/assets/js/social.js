
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

$(document).ready(function(){
	var data = JSON.parse(sessionStorage.getItem('userData'));
	var fbStatus = checkIfLoggedInViaFb(data.userData.providerData);
	checkTwitterLink(data);
	$("#doneBtn").click(function(){
		writeUserData(data);
	});
	$("#fbBtn").click(function(){
		if(!fbStatus)
			addFbProfile(data);
		else alert('Facbeook profile already linked');
	});
	$("#twitterBtn").click(function(){
		addTwitterProfile(data);
	})

});


function writeUserData(data, userRef){
	db.collection("users").doc(data.userData.uid).set({
		profile: data.profile
	}, {merge: true}).then(function(){
		goToNext();
	});
}

function checkIfLoggedInViaFb(data){
	if(typeof(data.userData)!=="undefined" && data.userData.providerData.providerId==="facebook.com"){
		$("#fbBtn").css({"background-color":"#FF778A", "color":"white"});
		$("#fbBtn").text("CONNECTED");
		return true;
	}
	return false;
}

function checkTwitterLink(data){
	if(typeof(data.userData.twitterProfile)!=="undefined"){
		$("#fbBtn").css({"background-color":"#FF778A", "color":"white"});
		$("#fbBtn").text("CONNECTED");
		return true;
	}
	return false;
}

function addFbProfile(user){
	var provider = new firebase.auth.FacebookAuthProvider();
 	provider.addScope('user_about_me');
 	provider.setCustomParameters({ 'display': 'popup' });
 	firebase.auth().signInWithPopup(provider).then(function(result){
 		if(result.user != null){
 			user.fbProfile = result.additionaluserInfo.profile;
 			user.fbProfile = result.additionaluserInfo.providerId;
 		}
 	}).catch(function(error){
 		var errorCode = error.code;
 		var errorMsg  = error.message;
 		alert (errorMsg);
 	});
}

function addTwitterProfile(user){
	var twitterProfile = {};
	var provider = new firebase.auth.TwitterAuthProvider();
	provider.setCustomParameters({'display': 'popup'});
	var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
	firebase.auth().signInWithPopup(provider).then(function(result){
		if(result.user!=null){
			user.twitterProfile.profile = result.additionaluserInfo.profile;
			user.twitterProfile.proiverId = result.additionaluserInfo.providerId;
		}
	});

  
}

function goToNext(){
	window.location.href='../profile';
}