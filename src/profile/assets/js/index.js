var db = firebase.firestore();
var data;
var imageUploads = [];

$(document).ready(function(){
	$("#signOutButton").click(function(){ signOut(); });
	$("#editPhotos").on("click",function(){ openModal(); });
	$("#modalClose").on("click", function(){ $(".modal").modal('close');});
	showLoader();
	getUserData();

});


function queryUserData(){
	firebase.auth().onAuthStateChanged(function(user){
		firebase.firestore().collection("users").doc(user.uid).get().then(function(doc){
			if(doc.exists){
				hideLoader();
				data = doc.data();
				sessionStorage.setItem("userData", JSON.stringify(data));
				setProfileImage(data.userData.photoURL);
				setName(data.userData.name);
				setAddr(data.userData);
				setBasicOverview(data);
				setupImageUploads();
				getImageFromDb();
			}
		});
	});
}
function getUserData(){
	if(sessionStorage.getItem("userData")!==null){
		hideLoader();
		data = JSON.parse(sessionStorage.getItem("userData"));
		setProfileImage(data.userData.photoURL);
		setName(data.userData.name);
		console.log(data.userData);
		setAddr(data.userData);
		setBasicOverview(data);
		setupImageUploads();
		getImageFromDb();
	}else
		queryUserData();
}


function signOut(){
	firebase.auth().signOut().then(function() {
		window.location.href='../signin';
	}, function(error) {
		console.error('Sign Out Error', error);
	});
}

function setProfileImage(imageURL){
	$("#user_img").attr("src", imageURL);
	$("#profile_img").attr("src", imageURL);
	$("#image1").attr("src", imageURL);
}

function setName(name){
	$("#nameLink").text(name);
	$("#name").text(name);
}

function setAddr(addr){
	var city = addr.city;
	var state = addr.state;
	$("#addr").text(city+", "+state);
}

function setBasicOverview(data){
	var userData = data.userData;
	var profileData = data.profile;
	$("#school").text(profileData.school);
	$("#job_title").text(profileData.job_title);
	$("#ethnicity").text(profileData.ethnicity);
	$("#drinker").text(parseDrinker(profileData.drinker));
	$("#home_town").text(profileData.home_city+", "+profileData.home_state);
	$("#smoker").text(parseSmoker(profileData.smoker));
	$("#languages").text(parseLanguages(profileData.languages));
	$("#description").text(userData.description);

}

function setupImageUploads(){
	$("#image2").click(function(){
		var id = this.id;
		$("#file-input2").on("change", function(event){
			loadImage(event, id);
		});
	});
	$("#image3").click(function(){
		var id = this.id;
		$("#file-input3").on("change", function(event){
			loadImage(event, id);
		});
	});
	$("#image4").click(function(){
		var id = this.id;
		$("#file-input4").on("change", function(event){
			loadImage(event, id);
		});
	});
	$("#image5").click(function(){
		var id = this.id;
		$("#file-input5").on("change", function(event){
			loadImage(event, id);
		});
	});
}

function loadImage(event, id){
	event.stopPropagation();
	event.preventDefault();
	var image =event.target.files[0];
	$("#"+id).attr("src", URL.createObjectURL(image));
	uploadImage(id, image);
}

function uploadImage(id, image){
	var metadata   = {"contentType":image.type};
    var storageRef = firebase.storage().ref('images/user/'+data.userData.uid+'/'+image.name);
    storageRef.put(image, metadata).then(function(snapshot){
    console.log(snapshot.metadata);
    var url = snapshot.downloadURL;
    imageUploads[id] = { [id]:url };
    data.images = imageUploads;
    sessionStorage.setItem("userData", data);
    storeImageUrl(id, url);
    console.log('File available at', url);
  }).catch(function(error) {
  	console.error('Upload failed:', error);
  });
}

function storeImageUrl(id, url){
	var image = { [id]:url };
	db.collection("users").doc(data.userData.uid).set({
		images: image
	}, {merge: true});
}

function getImageFromDb(){
	if(typeof(data.images)!=='undefined'){
		var images = data.images;
		if(typeof(images.image2)!=='undefined'){
			$("#image2").attr("src", images.image2);
		}
		if(typeof(images.image3)!=='undefined'){
			$("#image3").attr("src", images.image3);
		}
		if(typeof(images.image3)!=='undefined'){
			$("#image4").attr("src", images.image4);
		}
		if(typeof(images.image5)!=='undefined'){
			$("#image5").attr("src", images.image5);
		}
	}
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