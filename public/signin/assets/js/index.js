
 $(document).ready(function(){
	$("#signInBtn").click(function(){
	 	var email = $("#email").val();
	 	var pass  = $("#password").val();
		signInWithEmail(email, pass);
 	});

 	$("#fbLogin").click(function(){
 		signInWithFb();
 	});

 	$("#googleLogin").click(function(){
 		signInWithGoogle();
 	});
 
 });


function signInWithEmail(email, pass){
	firebase.auth().createUserWithEmailAndPassword(email, pass)
	.then(function(user){
		if(user!=null)
			goToNext();
	})
	.catch(function(error){
		var errorCode = error.code;
		var errorMsg  = error.message;
		alert(errorMsg);
	});

}

function signInWithFb(){
	var provider = new firebase.auth.FacebookAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result){
		if(result.user != null){
			goToNext();
		}
	}).catch(function(error){
		var errorCode = error.code;
		var errorMsg  = error.message;
		alert (errorMsg);
	});
}

function signInWithGoogle(){
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result){
		if(result.user != null){
			goToNext();
		}
	}).catch(function(error){
		var errorCode = error.code;
		var errorMsg  = error.message;
		alert(errorMsg);
	});
}
function goToNext(){
	window.location.href='../profile';
}