
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
var matchObj = {};
var toId;
var myId;
var data = JSON.parse(sessionStorage.getItem("userData"));
myId = data.userData.uid;
getMatchedUsers(data);


function getMatchedUsers(data){
	db.collection("users").where("userData.gender", "==", parseInt(data.userData.seeking))
	  .where("userData.seeking", "==", parseInt(data.userData.gender))
	    .get().then(function(querySnapshot) {
	      querySnapshot.forEach(function(doc) {
	          var match = doc.data();
	          $("#matched_users").append('<a class="mdl-navigation__link" id="'+match.userData.uid+'"">'+
	            '<i class="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>'+match.userData.name+'</a>');
	      });
	      $('.mdl-navigation__link').on("click",function(){
	          var id =  $(this).attr("id").replace("-", "");
	          setToId(id);
	          window.friendlyChat = new FriendlyChat();

	      });
	      
	  });
}

function setToId(id){
	toId = id;
}

function getToId(){
	return toId;
}

function getMyId(){
	return myId;
}

function getConvoToMe(){
	return toId+"_"+myId;
}

function getConvoFromMe(){
	return myId+"_"+toId;
}

function getAuth(){
	return firebase.auth();
}
function getDatabase(){
	return firebase.database();
}
function getStorage(){
	return firebase.storage();
}
function getFirestore(){
	return firebase.firestore();
}

$(document).ready(function(){
  //window.friendlyChat = new FriendlyChat();
});

