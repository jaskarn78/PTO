
 $(document).ready(function(){
 	sessionStorage.clear();
 	$("#registerBtn").on("click", function(){
	 	var email = $("#email").val();
	 	var pass  = $("#password").val();
	 	var name  = $("#name").val();
        if($("#name").val()=='')
            alert("Please enter your name");
        else
		  signUpWithEmail(email, pass, name);
 	});

 	$("#fbSignup").click(function(){
 		signUpWithFb();
 	});

 	$("#googleSignup").click(function(){
 		signUpWithGoogle();
 	});
 });

 function signUpWithEmail(email, pass, name){
 	var response='';
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION).then(function() {
      return firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(user){
 		if(user!=null){
 			user.displayName = name;
 			saveUserData(user);
 		}
 	}).catch(function(error){
 		var errorCode = error.code;
 		var errorMsg  = error.message;
 		alert(errorMsg);
 	});
 });
}

 function signUpWithFb(){
 	var provider = new firebase.auth.FacebookAuthProvider();
 	provider.addScope('user_about_me');
 	provider.setCustomParameters({ 'display': 'popup' });
 	signUpWithPersistance(provider);
 }



 function signUpWithGoogle(){
 	var provider = new firebase.auth.GoogleAuthProvider();
 	signUpWithPersistance(provider);
 }

 function signUpWithPersistance(provider){
     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
      return firebase.auth().signInWithPopup(provider).then(function(result){
        if(result.user !=null)
            checkIfuserExists(result);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorCode);
    })
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
    		goToProfile(doc.data());
    	else saveUserData(result);
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