
 $(document).ready(function(){
 	sessionStorage.clear();
 	$("#registerBtn").on("click", function(){
	 	var email = $("#email").val();
	 	var pass  = $("#password").val();
	  signUpWithEmail(email, pass);
 	});

 	$("#fbSignup").click(function(){
 		signUpWithFb();
 	});

 	$("#googleSignup").click(function(){
 		signUpWithGoogle();
 	});
 });

 function signUpWithEmail(email, pass){
 	var response='';
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user){
 		if(user!=null){
 			saveUserData(user);
 		}
 	}).catch(function(error){
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
        if(result.user !=null)
            checkIfuserExists(result);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode);
    });
 }



 function signUpWithGoogle(){
 	var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('email');
 	firebase.auth().signInWithPopup(provider).then(function(result){
        if(result!=null)
            checkIfuserExists(result);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode);
    });
 }

 

 function saveUserData(result){
 	sessionStorage.setItem('userData', JSON.stringify(result));
	window.location.href='../welcome';
}


 function checkIfuserExists(result){
 	 firebase.firestore().collection('users').doc(result.user.uid)
    .get().then(function(doc){
    	if(doc.exists)
    	   saveUserData(doc.data());
       else {
            var additional = result.additionalUserInfo.profile;
            var userData = {"email":additional.email, "displayName":result.user.displayName,
                        "photoURL":result.user.photoURL, "providerData":result.user.providerData,
                         "emailVerified":result.user.emailVerified, "uid":result.user.uid};
            result.email = additional.email;
            result.photoURL = result.user.photoURL;
            saveUserData(result);
        }
    });
 }

 function goToProfile(result){
 	sessionStorage.setItem('userData', JSON.stringify(result));
 	window.location.href='../profile';
 }



 function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}