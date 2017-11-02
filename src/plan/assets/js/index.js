var checked;
$(document).ready(function(){
	$('input').change(function() {
	    if (this.checked) {
	    	checked = this;
	        var response = $('label[for="' + this.id + '"]');
	        verifyChecked(response);
	    }
	});
	$("#selectPlan").on("click", function(){
		if(typeof(checkedVal)!=='undefined' || checkedVal!=null){
			var checkedVal = $("#"+checked.id).val();
			saveplanData(checkedVal);
		}else alert("Please select a plan");
	})
});

function saveplanData(planType) {
	var currentUser = JSON.parse(sessionStorage.getItem("userData"));
	var plan = {"type":planType, "cost":getCost(planType)};
	currentUser.plan = plan;
	sessionStorage.setItem("userData", JSON.stringify(currentUser));
	writeUserData(currentUser);
}

function writeUserData(user) {
	firebase.firestore().collection("users").doc(user.userData.uid).set({
		userData : {"name":user.userData.name, "email":user.userData.email, "photoURL":user.userData.photoURL, 
		"birthday":user.userData.bday,"description":user.userData.description, "city":user.userData.city, 
		"country":user.userData.country,"state":user.userData.state,"zip":user.userData.zip,
		"lat":user.userData.lat,"lng":user.userData.lng,"provderData":user.userData.providerData,
		"age":user.userData.age, "uid":user.userData.uid, "gender":parseInt(user.userData.gender),
		"seeking":parseInt(user.userData.seeking), "plan":user.plan}
	}).catch(function(error){
		alert(error.message);
	}).then(function(){
		console.log(user);
		goToNext();
	});
}

function goToNext(){
	window.location.href="../checkout";
}

function getCost(planType){
	switch(planType){
		case "0"  : return 0;
		case "1"  : return 40;
		case "3"  : return 36;
		case "6"  : return 34;
		case "9"  : return 32;
		case "12" : return 30;
	}
}
function verifyChecked(response){
	if(response.html()=="Free Trial")
		setActive($("#freeTrialHeader"), $("#freeL"), $("#freeP"), response, $("#freeTrialRadio"));
	else
		setDefault($("#freeTrialHeader"), $("#freeL"), $("#freeP"), $("#free"), $("#freeTrialRadio"))
	
	if(response.html()=="1 Month")
		setActive($("#oneMonthHeader"), $("#oneL"), $("#oneP"), response, $("#oneMonthRadio"));
	else
		setDefault($("#oneMonthHeader"), $("#oneL"), $("#oneP"), $("#one"), $("#oneMonthRadio"));

	if(response.html()=="3 Months")
		setActive($("#threeMonthHeader"), $("#threeL"), $("#threeP"), response, $("#threeMonthRadio"));
	else
		setDefault($("#threeMonthHeader"), $("#threeL"), $("#threeP"), $("#three"), $("#threeMonthRadio"));
	if(response.html()=="6 Months")
		setActive($("#sixMonthHeader"), $("#sixL"), $("#sixP"), response, $("#sixMonthRadio"));
	else
		setDefault($("#sixMonthHeader"), $("#sixL"), $("#sixP"), $("#six"), $("#sixMonthRadio"));

	if(response.html()=="9 Months")
		setActive($("#nineMonthHeader"), $("#nineL"), $("#nineP"), response, $("#nineMonthRadio"));
	else
		setDefault($("#nineMonthHeader"), $("#nineL"), $("#nineP"), $("#nine"), $("#nineMonthRadio"));

	if(response.html()=="12 Months")
		setActive($("#twelveMonthHeader"), $("#twelveL"), $("#twelveP"), response, $("#twelveMonthRadio"));
	else
		setDefault($("#twelveMonthHeader"), $("#twelveL"), $("#twelveP"), $("#twelve"), $("#twelveMonthRadio"));

}

function setActive(e1, e2, e3, e4, e5){
	setBackgroundActive(e1);
	setTextColorActive(e2);
	setTextColorActive(e3);
	setTextColorActive(e4);
	setRadioButtonActive(e5);
}

function setDefault(e1, e2, e3, e4, e5){
	setDefaultBackground(e1);
	setDefaultText(e2);
	setDefaultText(e3);
	setDefaultText(e4);
	setDefaultRadioButton(e5);
}


function setBackgroundActive(element){
	element.css({"background-image": "-ms-linear-gradient(bottom right, #FF696C 20%, #FF5090 100%)",
	"background-image": "-moz-linear-gradient(bottom right, #FF696C 20%, #FF5090 100%)",
	/* Opera */ 
	"background-image": "-o-linear-gradient(bottom right, #FF696C 20%, #FF5090 100%)",
	/* Webkit (Safari/Chrome 10) */ 
	"background-image": "-webkit-gradient(linear, right bottom, left top, color-stop(20, #FF696C), color-stop(100, #FF5090))",
	/* Webkit (Chrome 11+) */ 
	"background-image": "-webkit-linear-gradient(bottom right, #FF696C 20%, #FF5090 100%)",
	/* W3C Markup */ 
	"background-image": "linear-gradient(to top left, #FF696C 20%, #FF5090 100%)"});
}

function setRadioButtonActive(element){
	element.css({"background-color":"white", "border-color":"white"});
}
function setDefaultRadioButton(element){
	element.css({"background-color":"#FF758A", "border-color":"#FF758A"});
}

function setTextColorActive(element){
	element.css({ "color":"white" });
}

function setDefaultBackground(element){
	element.css({"background":"white"});
}
function setDefaultText(element){
	element.css({"color":"black"});
}





