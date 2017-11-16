var selectedOption;
var showDisability;
var okWithDisability;
var myData = JSON.parse(sessionStorage.getItem("userData"));
$(document).ready(function(){
	setupKnownFields();
	getSelectedDisabilityOption();
	$("#finishBtn").click(getAllFields);

 	
 });

function setupKnownFields(){
	$('select').material_select();
	var name = myData.userData.name.split(" ")[0];
	$("#welcomeName").text("Welcome "+name+"!");
	$("#photoURL").attr("src", myData.userData.photoURL);
}

function getAllFields(){
	if($("#showOnProfile").is(":visible"))
		showDisability = $("#showDisability").is(":checked");
	else showDisability = false;
	okWithDisability = $("#okWithDisability").val();
	saveUserData();

}

function getSelectedDisabilityOption(){
	selectedOption = $("#disability").val();
	$("#disability").change(function(){
		selectedOption = $(this).val();
		if($(this).val() !== "No")
			$("#showOnProfile").show();
		else $("#showOnProfile").hide();
	});
}

function saveUserData(){
	myData.userData.disability = {"disability":selectedOption, "showDisability":showDisability, 
	"okWithDisability":parseInt(okWithDisability)};
	sessionStorage.setItem("userData", JSON.stringify(myData));
	goToNext();
}


function goToNext(){
	window.location.href='../plan';
}