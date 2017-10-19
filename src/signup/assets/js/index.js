 var config = {
    apiKey: "AIzaSyDXjq1Or10iD_J229t3qxyWxskmDBxjJ3s",
    authDomain: "ptoapp-90ad1.firebaseapp.com",
    databaseURL: "https://ptoapp-90ad1.firebaseio.com",
    projectId: "ptoapp-90ad1",
    storageBucket: "ptoapp-90ad1.appspot.com",
    messagingSenderId: "101372763303"
  };
  firebase.initializeApp(config);

 $(document).ready(function(){
 	sessionStorage.clear();
 	$("#registerBtn").click(function(){
	 	var email = $("#email").val();
	 	var pass  = $("#password").val();
		signUpWithEmail(email, pass);
 	});

 	$("#fbLogin").click(function(){
 		signUpWithFb();
 	});

 	$("#googleLogin").click(function(){
 		signUpWithGoogle();
 	});
 });

 function signUpWithEmail(email, pass){
 	var response='';
 	firebase.auth().createUserWithEmailAndPassword(email, pass)
 	.then(function(user){
 		if(user!=null)
 			saveUserData(user);
 	})
 	.catch(function(error){
 		var errorCode = error.code;
 		var errorMsg  = error.message;
 		alert(errorMsg);
 	});

 }

 function signUpWithFb(){
 	var provider = new firebase.auth.FacebookAuthProvider();
 	provider.addScope('user_about_me');
 	provider.setCustomParameters({ 'display': 'popup' });
 	firebase.auth().signInWithPopup(provider).then(function(result){
 		if(result.user != null){
 			saveUserData(result);
 		}
 	}).catch(function(error){
 		var errorCode = error.code;
 		var errorMsg  = error.message;
 		alert (errorMsg);
 	});
 }

 function signUpWithGoogle(){
 	var provider = new firebase.auth.GoogleAuthProvider();
 	firebase.auth().signInWithPopup(provider).then(function(result){
 		if(result.user != null){
 			saveUserData(result);
 		}
 	}).catch(function(error){
 		var errorCode = error.code;
 		var errorMsg  = error.message;
 		alert(errorMsg);
 	});
 }

 function saveUserData(result){
 	sessionStorage.setItem('userData', JSON.stringify(result));
	window.location.href='../basicinfo';

 }
 function getUserData(){
 	database.ref('users/'+userId).once('value').then(function(snapshot){
 		
 	});

 }



 function writeUserData(result) {
 	console.log(result);
	/*firebase.database().ref('users/' + userId).set({
		username: name,
		email: email,å
		profile_picture : imageUrl
		profile_status : 0
	}).catch(function(error){
		alert(error.message);
	});*/
}



 function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}