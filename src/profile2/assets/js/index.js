var user;
$(document).ready(function(){
	setupDropZone();
	if(sessionStorage.getItem("userData")==null)
		getUserDataFromDb();
	else getUserDataFromSession();
});


function getUserDataFromDb(){
	console.log('db');
}

function getUserDataFromSession(){
	user = JSON.parse(sessionStorage.getItem("userData"));
	console.log(user);
	setupProfile();
}

function setupProfile(){
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
	$("#jobDib span").text(profile.job_title);
	$("#ethnicityDiv span").text(profile.ehtnicity);
	$("#homeTownDiv span").text(profile.home_city+", "+profile.home_state);
	$("#drinkerDiv span").text(parseDrinker(profile.drinker));
	$("#smokerDiv span").text(parseSmoker(profile.smoker));
	$("#languageDiv span").text(parseLanguages(profile.languages));
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

function assignImage(cur, file, holder, oldHolder){
	cur.removeFile(file);
	var image = URL.createObjectURL(file);
	console.log(file.name);
	$(holder).attr("src", image);
	$(oldHolder).attr("src", image);
	uploadImage(file);
}

function uploadImage(image){
	var metadata   = {"contentType":image.type};
    var storageRef = firebase.storage().ref('images/user/'+user.userData.uid+'/');
    storageRef.put(image, metadata).then(function(snapshot){
    var url = snapshot.downloadURL;
    console.log('File available at', url);
    
  }).catch(function(error) {
  	console.error('Upload failed:', error);
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