
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
 	if(sessionStorage.getItem('userData')!==null){
		var user = JSON.parse(sessionStorage.getItem('userData'));
		getName(user);
		getImage(user);
		getDescription(user);
		setGenderAge(user);
		setLocation(user);
		$("#profileImageBtn").click(function(){
			$("#my_file").click();
		});
		var image = loadImage(user);
		$("#welcomeBtn").click(function(){
			saveData(user);
		});
 	}
	else 
		window.location.href='../signup';
 	
 });

function getName(data){
	if(typeof(data.userData.name)!=='undefined'){
		$("#name").attr("value", data.userData.name);
	}
}

function getImage(data){
	if(typeof(data.userData.photoURL)!=='undefined')
		$("#profile").attr("src", data.userData.photoURL);
	else 
		$("#profile").attr("src", 'assets/img/person.png');
}

function setGenderAge(data){
	$("#genderAge").text(parseGender(data.userData.genderVal)+", "+data.userData.age);
}

function setLocation(data){
	console.log(data);
	$("#location").text(data.userData.locationData.city+", "+data.userData.locationData.state);
}

function loadImage(user){
	$("#my_file").on("change", function(event){
		event.stopPropagation();
		event.preventDefault();
		var image =event.target.files[0];
		$("#profile").attr("src", URL.createObjectURL(image));
		uploadImage(image, user);

	});	
}


function saveData(data){
	var description = $("#description").val();
	var name 		= $("#name").val();
	if(description!="" && name!=""){
		data.userData.description  = description;
		data.userData.name 		   = name;
		sessionStorage.setItem("userData", JSON.stringify(data));
		writeUserData(data);
	}
	else
		alert('Please complete all fields');
}

function getDescription(data){
	if(typeof(data.userData.description)!=='undefined')
		$("#description").text(data.userData.description);
}

 function writeUserData(user) {
	db.collection("users").doc(user.userData.uid).set({
		userData : {"name":user.userData.name, "email":user.userData.email, "photoURL":user.userData.photoURL, 
		"birthday":user.userData.bday,"description":user.userData.description, "city":user.userData.locationData.city, 
		"country":user.userData.locationData.country,"state":user.userData.locationData.state,"zip":user.userData.locationData.zip,
		"lat":user.userData.locationData.lat,"lng":user.userData.locationData.lng,"provderData":user.userData.providerData,
		"accessToken":user.userData.access_token, "age":user.userData.age, "uid":user.userData.uid, "gender":user.userData.genderVal,
		"seeking":user.userData.seeking}
	}).catch(function(error){
		alert(error.message);
	}).then(function(){
		goToNext();
	});
}

function uploadImage(image, user){
	var metadata   = {"contentType":image.type};
    var storageRef = firebase.storage().ref('images/user/'+user.userData.uid+'/'+image.name);
    storageRef.put(image, metadata).then(function(snapshot){
    console.log(snapshot.metadata);
    var url = snapshot.downloadURL;
    user.userData.photoURL = url;
    console.log('File available at', url);
  }).catch(function(error) {
  	console.error('Upload failed:', error);
  });
}

function parseGender(genderVal){
    var genderArr = ["Male (Cis)", "Male (Trans)","Genderqueer", "Female (Cis)", "Female (Trans)", "Genderqueer","Intersex", "Agender"];
    return genderArr[genderVal];
}


function goToNext(){
	window.location.href='../AddImage';
}