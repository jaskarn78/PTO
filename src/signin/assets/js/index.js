
 $(document).ready(function(){
   console.log(localStorage);


 	sessionStorage.clear();
  localStorage.clear();
 	$("#registerBtn").on("click", function(){
	 	var email = $("#email").val();
	 	var pass  = $("#password").val();
		signIWithEmail(email, pass);
 	});
 	$("#fbSignup").click(signInWithFb);
 	$("#googleSignup").click(signInWithGoogle);
 });

 function signIWithEmail(email, pass, name){
  firebase.auth().signInWithEmailAndPassword(email, pass).then(function(user){
      if(user!=null){
        checkIfEmailuserExists(user);
    }
  }).catch(function(error){
   		var errorCode = error.code;
   		var errorMsg  = error.message;
      if(errorCode==="auth/wrong-password" || errorCode==="auth/user-not-found")
   		 alert("Incorrect email or password");
      else if(errorMsg=="The email address is badly formatted."){
          alert("Invalid email address");
      }
   	});
 }

 function signInWithFb(){
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





 function signInWithGoogle(){
 	var provider = new firebase.auth.GoogleAuthProvider();
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

 function saveUserData(result){
 	sessionStorage.setItem('userData', JSON.stringify(result));
    goToProfile();
}

 function checkIfEmailuserExists(result){
  console.log(result);
   firebase.firestore().collection('users').doc(result.uid)
    .get().then(function(doc){
      if(doc.exists){
        saveUserData(doc.data());
      }
    });
 }

 function checkIfuserExists(result){
 	 firebase.firestore().collection('users').doc(result.user.uid)
    .get().then(function(doc){
    	if(doc.exists){
        saveUserData(doc.data());
      }
    });
 }

 function goToProfile(){
 	window.location.href='../profile';
 }



 function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}