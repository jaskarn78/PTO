var user;
var imageUploads = [];

$(document).ready(function(){
	showLoader();
	setupDropZone();
	$("#signOutBtn").on("click", function(){ signOut(); });
	user = JSON.parse(sessionStorage.getItem("userData"));
	console.log(user);
	getUserDataFromDb();
});


function getUserDataFromDb(){
	console.log('db');
}

function getUserDataFromSession(){
	user = JSON.parse(sessionStorage.getItem("userData"));
	console.log(user);
	setupProfile(user);
	getImageFromSession(user);
	hideLoader();
}
function getUserDataFromDb(){
	firebase.auth().onAuthStateChanged(function(user){
		firebase.firestore().collection("users").doc(user.uid).get().then(function(doc){
			if(doc.exists){
				//hideLoader();
				user = doc.data();
				sessionStorage.setItem("userData", JSON.stringify(user));
				setupProfile(user);
				getImageFromSession(user);
				hideLoader();
			}
		});
	});
}

function setupProfile(user){
	var userInfo = user.userData;
	var profile = user.profile;
	$("#navbar-name").text(userInfo.name);
	$("#profile-page-name").text(userInfo.name);
	$("#userLocation").text(userInfo.city+", "+userInfo.state);
	$("#userImage").attr("src", userInfo.photoURL);
	$("#profilePicture").attr("src", userInfo.photoURL);

	$("#genderAge").text(parseGender(userInfo.gender)+", "+userInfo.age);
	$("#description").text(userInfo.description);
	//$("#edDiv span").text(profile.school);
	//$("#jobDiv span").text(profile.job_title);
	//$("#ethnicityDiv span").text(profile.ethnicity);
	//$("#homeTownDiv span").text(profile.home_city+", "+profile.home_state);
	//$("#drinkerDiv span").text(parseDrinker(profile.drinker));
	//$("#smokerDiv span").text(parseSmoker(profile.smoker));
	//$("#languageDiv span").text(parseLanguages(profile.languages));
	$("#drop1").attr("src", $("#profilePicture").attr("src"));
	$("#drop2").attr("src", $("#userImage1").attr("src"));
	$("#drop3").attr("src", $("#userImage2").attr("src"));
	$("#drop4").attr("src", $("#userImage3").attr("src"));
	$("#drop5").attr("src", $("#userImage4").attr("src"));
}

function setupDropZone(){	
	Dropzone.options.dropimage1 = {
		url:".",
		paramName: "file",
	    dictDefaultMessage: "",
		accept: function(file, done){
			assignImage(this, file, "#drop1", "#profilePicture");
		}
	}
	Dropzone.options.dropimage2 = {
		url:".",
		paramName: "file",
	    dictDefaultMessage: "",
		accept: function(file, done){
			assignImage(this, file, "#drop2", "#userImage1");
		}
	}
	Dropzone.options.dropimage3 = {
		url:".",
		paramName: "file",
	    dictDefaultMessage: "",

		accept: function(file, done){
			assignImage(this, file, "#drop3", "#userImage2");
		}
	}
	Dropzone.options.dropimage4 = {
		url:".",
		paramName: "file",
		dictDefaultMessage: "",
		accept: function(file, done){
			assignImage(this, file, "#drop4", "#userImage3");
			
		}
	}
	Dropzone.options.dropimage5 = {
		url:".",
		paramName: "file",
		dictDefaultMessage: "",
		accept: function(file, done){
			assignImage(this, file, "#drop5", "#userImage4");
			
		}
	}
}

function assignImage(cur, file, holder, id){
	cur.removeFile(file);
	var image = URL.createObjectURL(file);
	console.log(file.name);
	$(holder).attr("src", image);
	$(id).attr("src", image);
	uploadImage(file, id);
}

function uploadImage(image, id){
	var imageName = id.substring(1, id.length);
	var metadata   = {"contentType":image.type};
    var storageRef = firebase.storage().ref('images/user/'+user.userData.uid+'/'+imageName);
    storageRef.put(image, metadata).then(function(snapshot){
    var url = snapshot.downloadURL;
    imageUploads[imageName] = { [imageName]:url };
    user.images[imageName] = url;
    sessionStorage.setItem("userData", JSON.stringify(user));
    console.log(JSON.parse(sessionStorage.getItem("userData")));
    storeImageUrl(imageName, url);
    console.log('File available at', url);
  }).catch(function(error) {
  	console.error('Upload failed:', error);
  });
}

function storeImageUrl(id, url){
	var image = { [id]:url };
	firebase.firestore().collection("users").doc(user.userData.uid).set({
		images: image
	}, {merge: true})
	.then(function(){
		console.log("Complete");
	});
}

function getImageFromSession(user){
	console.log(JSON.parse(sessionStorage.getItem("userData")));
	if(typeof(user.images)!=='undefined'){
		var images = user.images;
		if(typeof(images.userImage1)!=='undefined'){
			$("#userImage1").attr("src", images.userImage1);
			$("#drop2").attr("src", images.userImage1);
		}
		if(typeof(images.userImage2)!=='undefined'){
			$("#userImage2").attr("src", images.userImage2);
			$("#drop3").attr("src", images.userImage2);

		}
		if(typeof(images.userImage3)!=='undefined'){
			$("#userImage3").attr("src", images.userImage3);
			$("#drop4").attr("src", images.userImage3);

		}
		if(typeof(images.userImage4)!=='undefined'){
			$("#userImage4").attr("src", images.userImage4);
			$("#drop5").attr("src", images.userImage4);

		}
	}
}

function signOut(){
	firebase.auth().signOut().then(function() {
		sessionStorage.clear();
		window.location.href='../signin';
	}, function(error) {
		console.error('Sign Out Error', error);
	});
}


function parseGender(genderVal){
    var genderArr = ["Male (Cis)", "Male (Trans)","Genderqueer", "Female (Cis)", "Female (Trans)", "Genderqueer","Intersex", "Agender"];
    return genderArr[genderVal];
}
function parseSmoker(smokerVal){
	var smokerArr= ["No", "Daily", "Occasionally", "Trying to quit", "Not Set"];
	return smokerArr[smokerVal];
}
function parseDrinker(drinkerVal){
	var drinkerArr = ["No", "Socially", "Often", "Not Set"];
	return drinkerArr[drinkerVal];
}
function parseLanguages(languageVals){
	var languageArr = ["Akan","Amharic","Araic","Assamese","Awadhi","Azerbaijani","Balochi","Belarusian","Bengali (Bangla)","Bhojpuri","Burmese","Cebuano (Visayan)","Chewa","Chhattisgarhi","Chittagonian","Czech","Deccan","Dhundhari","Dutch","Eastern Min (Fuzhounese)","English","French","Fula","GanChinese","German","Greek","Gujarati","HaitianCreole","Hakka","Haryanvi","Hausa","Hiligaynon/Ilonggo (Visayan)","Hindia","Hmong","Hungarian","Igbo","Ilocano","Italian","Japanese","Javanese","Jin","Kannada","Kazakh","Khmer","Kinyarwanda","Kirundi","Konkani","Korean","Kurdish","Madurese","Magahi","Maithili","Malagasy","Malay (Malaysian/Indonesian)","Malayalam","Mandarin","Marathi","Marwari","Mossi","Nepali","Northern Min","Odia (Oriya)","Oromo","Pashto","Persian","Polish","Portuguese","Punjabi","Quechua","Romanian","Russian","Saraiki","Serbo",-"Croatian","Shona","Sindhi","Sinhalese","Somali","Southern Min (Hokkien/Teochew)","Spanish","Sundanese","Swedish","Sylheti","Tagalog (Filipino)","Tamil","Telugu","Thai","Turkish","Turkmen","Ukrainian","Urdu","Uyghur","Uzbek","Vietnamese","Wu (e.g.Shanghainese)","Xhosa","Xiang (Hunanese)","Yoruba","Yue (Cantonese)","Zhuang","Zulu"];
	var languages = languageArr[languageVals[0]];
	for(i=1; i<languageVals.length; i++){
		languages+=", "+languageArr[i];
	}
	return languages;
}