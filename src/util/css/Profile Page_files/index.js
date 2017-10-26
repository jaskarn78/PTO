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
	setupProfile();
}

function setupProfile(){
	var userInfo = user.userData;
	$("#navbar-name").text(userInfo.name);
	$("#profile-page-name").text(userInfo.name);
	$("#userLocation").text(userInfo.city+", "+userInfo.state);
	$("#userImage").attr("src", userInfo.photoURL);
	$("#profilePicture").attr("src", userInfo.photoURL);

	$("#genderAge").text(parseGender(userInfo.gender)+", "+userInfo.age);
	$("#description").text(userInfo.description);
}

function setupDropZone(){	
	Dropzone.options.editPhotos = {
		url:".",
		paramName: "file",
		accept: function(file, done){
			if($("#userImage1").attr("src")=="assets/images/person.png"){
				$("#userImage1").attr("src", URL.createObjectURL(file));
			}
		}
	}
}

function setImageFromDropZone(file){
	console.log($("userImage1"));
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