 var config = {
        apiKey: "AIzaSyD657gqCD1kkqRTmrqy0mIbw9gpfiOKyQg",
        authDomain: "dkweb-176823.firebaseapp.com",
        databaseURL: "https://dkweb-176823.firebaseio.com",
        projectId: "dkweb-176823",
        storageBucket: "dkweb-176823.appspot.com",
        messagingSenderId: "412591321120"
 };
firebase.initializeApp(config);

$(document).ready(function(){
	var user = JSON.parse(sessionStorage.getItem("userData"));
	console.log(user);
	setImage(user.userData.photoURL);
	setName(user.userData.name);
	$("#fillProfileBtn").click(function(){
		//sendVerificationEmail(userData, user);
		window.location.href='../additional';
	});
});

function setImage(imageURL){
	$("#profile_img").attr("src", imageURL);
}

function setName(name){
	name = name.split(" ");
	$("#name").text(name[0]+', you look great!');
}

function sendVerificationEmail(data){
	firebase.auth().onAuthStateChanged(function(user) {
		var user = firebase.auth().currentUser;
		if(user != null){
			if(user.emailVerified){
				alert('email verified');
			}else{
				alert('email not verified');
			}
		}
	});
}



