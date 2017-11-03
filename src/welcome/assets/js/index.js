var placeSearch, autocomplete;
var city, state, country, zip, lat, lng;
 $(document).ready(function(){
 	$("#zip").on("focus", geolocate);
 	if(sessionStorage.getItem('userData')!==null){
		var userData = JSON.parse(sessionStorage.getItem('userData'));
		setKnownData(userData);
		var image = loadImage(userData.user);

		$("#profileImageBtn").on("click",function(){ $("#my_file").click(); });
	    $("#bday").datepicker();
		$("#finishBtn").click(function(){ saveData(userData);});
 	}
	else window.location.href='../signup';
 	
 });

 function setKnownData(data){
 	console.log(data);
 	if(data.user.photoURL != null)
 		$("#photoURL").attr("src", data.user.photoURL);
 	else $("#photoURL").attr("src", "assets/img/person.png");

 	if(data.user.displayName != null)
 		$("#name").attr("value", data.user.displayName);

 	if(data.userData != null){
	 	if(data.userData.birthday != null)
	 		$("#bday").attr("value", data.userData.birthday);
	 	if(data.userData != null)
			$("#zip").attr("value", data.userData.zip);
	}
}


function loadImage(user){
	$("#my_file").on("change", function(event){
		event.stopPropagation();
		event.preventDefault();
		var image =event.target.files[0];
		$("#photoURL").attr("src", URL.createObjectURL(image));
		uploadImage(image, user);

	});	
}
function uploadImage(image, user){
	var metadata   = {"contentType":image.type};
    var storageRef = firebase.storage().ref('images/user/'+user.userData.uid+'/'+image.name);
    storageRef.put(image, metadata).then(function(snapshot){
    var url = snapshot.downloadURL;
    user.userData.photoURL = url;
    console.log('File available at', url);
  }).catch(function(error) {
  	console.error('Upload failed:', error);
  });
}


function saveData(data){
	var userData = {};
	userData.name 		= $("#name").val();
	userData.birthday 	= $("#bday").val();
	var location 		= getLocationFromZip($("#zip").val());
	userData.zip 		= zip;
	userData.city 		= city;
	userData.state 		= state;
	userData.lat 		= lat;
	userData.lng 		= lng;
	userData.country 	= country;
	userData.email 		= data.user.email;
	userData.verified 	= data.user.emailVerified;
	userData.photoURL 	= data.user.photoURL;
	userData.uid 		= data.user.uid;

	if(data.user.apiKey != null)
		userData.apiKey = data.user.apiKey
	if(data.user.credential != null)
		userData.credential = user.credential;
	if(data.user.additionalUserInfo != null){
		userData.link = user.additionalUserInfo.profile.link;
		userData.locale = user.additionalUserInfo.locale;
	}

	
	data.userData = userData;
	sessionStorage.setItem("userData" ,JSON.stringify(data));
	goToNext();

}

function getLocationFromZip(zip){
	var Httpreq = new XMLHttpRequest(); // a new request
    if(zip.length==5 && zip.match(/^[0-9]+$/)){   
        var url="https://maps.googleapis.com/maps/api/geocode/json?address="+zip+"&sensor=true";
        Httpreq.open("GET",url, false);
        Httpreq.send(null);
        var jsonObj      = JSON.parse(Httpreq.responseText);
        var locationData = {};
        locationData.zip     = zip;
        locationData.city    = jsonObj.results[0].address_components[1].long_name;
        locationData.state   = jsonObj.results[0].address_components[3].short_name;
        locationData.country = jsonObj.results[0].address_components[4].short_name;
        locationData.lat     = jsonObj.results[0].geometry.location.lat;
        locationData.lng     = jsonObj.results[0].geometry.location.lng;
        return locationData;
   }
}

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete((document.getElementById('zip')),
    {types: ['geocode']});

	// When the user selects an address from the dropdown, populate the address
	// fields in the form.
	autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
	// Get the place details from the autocomplete object.
	var place = autocomplete.getPlace();
	console.log(place);
	city = place.address_components[1].long_name;
	state = place.address_components[3].short_name;
	country = place.address_components[4].short_name;
	zip = place.address_components[0].long_name;
	lat = place.geometry.location.lat();
	lng = place.geometry.location.lng();
	$("#zip").val(parseInt(zip));

}

function geolocate() {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(function(position) {
	    var geolocation = {
	      lat: position.coords.latitude,
	      lng: position.coords.longitude
	    };
	    var circle = new google.maps.Circle({
	      center: geolocation,
	      radius: position.coords.accuracy
	    });
	    autocomplete.setBounds(circle.getBounds());
	  });
	}
}




function goToNext(){
	window.location.href='../plan';
}