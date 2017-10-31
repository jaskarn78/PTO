
var db = firebase.firestore();
var data = JSON.parse(sessionStorage.getItem("userData"));
var user = data.userData;
var matchObj = {};

$(document).ready(function(){
	getAllUsers();
	//massLoad();
	//showLoader();
	//$("#nameLink").text(user.name);
	//getMatches(user);
	//console.log(JSON.parse(sessionStorage.getItem("matchData")));

});
function getMatches(myInfo){
	db.collection("users").where("userData.gender", "==", parseInt(myInfo.seeking)).where("userData.seeking", "==", parseInt(myInfo.gender)).limit(100)
		.get().then(function(querySnapshot) {
	    querySnapshot.forEach(function(doc) {
	    	console.log(doc.data());
	    	matchObj[doc.data().userData.uid.replace("-", "")] = doc.data();
			//storeMatches(doc.data());
	        populateMatches(doc.data());
	        //populateChat(doc.data());
	        hideLoader();
	    });
	    storeMatches(matchObj)

	});

}

function storeMatches(matchData){
	sessionStorage.setItem("matchData", JSON.stringify(matchObj));
}

function populateMatches(matchData){
	var userData = matchData.userData;
	$("#profile").append('<div class="col-md-4">\
          <div class="card card-profile">\
            <div class="card-avatar">\
              <a href="../member/member.html?match='+userData.uid.replace("-", "")+'">\
                <img class="img" src="'+userData.photoURL+'" />\
              </a>\
            </div>\
            <div class="card-content">\
              <h4 class="card-title">'+userData.name+'</h4>\
              <p class="description">Description goes here</p>\
              <h6 class="category text-muted">'+parseGender(userData.gender)+", "+getAgeFromDob(userData.birthday)+'</h6>\
              <div class="footer">\
                <a href="#pablo" id="'+userData.uid+' "class="btn btn-just-icon btn-linkedin btn-round"><i class="fa fa-linkedin"></i></a>\
                <a href="#pablo" class="btn btn-just-icon btn-twitter btn-round"><i class="fa fa-twitter"></i></a>\
                <a href="#pablo" class="btn btn-just-icon btn-dribbble btn-round"><i class="fa fa-dribbble"></i></a>\
              </div>\
            </div>\
          </div>\
        </div>');
}



function getAgeFromDob(bday){
	var ageDiffMs = Date.now() - (new Date(bday)).getTime();
	var ageDate = new Date(ageDiffMs);
	return Math.abs(ageDate.getUTCFullYear()-1970);
}

function parseGender(genderVal){
	var genderArr = ["Male (Cis)", "Male (Trans)","Genderqueer", "Female (Cis)", "Female (Trans)", "Genderqueer","Intersex", "Agender"];
	return genderArr[genderVal];
}

function getAllUsers(){
	var db = firebase.firestore().collection("users").doc(user.uid);
	db.get().then(function(doc){
		if(doc.exists){
			var compatibility = doc.data().compatibility;
			console.log("Do you drink? "+ parseDrinker(compatibility.drinker));
			console.log("Would you date somebody that drinks? "+parseDrinkerImportance(compatibility.drinker_importance));
			console.log("Are you financially stable? " +parseFinancial(compatibility.financially_stable));
			console.log("How important is financial stability? "+parseFinancialI(compatibility.financially_stable_importance));
			console.log("Do you have kids? "+ parseHaveKids(compatibility.have_kids));
			console.log("Would you date someone with kids? "+haveKidsI(compatibility.have_kids_importance));
			console.log("Do you use marijuana? "+parseMarijuanaUse(compatibility.marijuana_use));
			console.log("Would you date someone who uses marijuana? "+marijuanaUseI(compatibility.marijuana_use_importance));
			console.log("Do you want to get married? "+parseMarried(compatibility.married));
			console.log("How important is getting married to you? "+marriedI(compatibility.married_importance));
			console.log("Do you misuse drungs? "+parseMisuseDrugs(compatibility.misuse_drugs));
			console.log("Would you date someone who misuses drugs? "+misuse_drugs_importance(compatibility.misuse_drugs_importance));
			console.log("Do you enjoy the company of pets? "+parsePets(compatibility.pets));
			console.log("How important are pets to you? "+petsI(compatibility.pets_importance));
			console.log("Are you religious? "+parseReligious(compatibility.religious));
			console.log("How imporant is religion to you? "+religiousI(compatibility.religious_importance));
			console.log("Do you use tobacco? "+parseTobaccoUser(compatibility.tabacco_use));
			console.log("Would you date someone who uses tobacco? "+tobaccoI(compatibility.tabacco_use_importance));
			console.log("Do you want kids? "+parseWantKids(compatibility.want_kids));
			console.log("How important is having kids to you? "+wantKidsI(compatibility.want_kids_importance));

		}
	});

}

function parseDrinker(index){
	var drinkerArr = ["Yes", "No"];
	return drinkerArr[index];
}

function parseDrinkerImportance(index){
	var drinkerI = ["Yes", "No", "No Preference"];
	return drinkerI[index];
}

function parseFinancial(index){
	var financialArr = ["Yes", "No"];
	return financialArr[index];
}
function parseFinancialI(index){
	var financialI = [25,10,1,0];
	return financialI[index];
}

function parseHaveKids(index){
	var haveKidsArr = ["Yes", "No"];
	return haveKidsArr[index];
}

function haveKidsI(index){
	var haveKidsI = ["Yes", "No"];
	return haveKidsI[index];
}
function parseMarijuanaUse(index){
	var marijuanaUseArr = ["Yes", "No"];
	return marijuanaUseArr[index];
}
function marijuanaUseI(index){
	var marijuanaUseArr = ["Yes", "No", "No Preference"];
	return marijuanaUseArr[index];
}
function parseMarried(index){
	var marriedArr = ["Yes", "No", "Not Sure"];
	return marriedArr[index];
}
function marriedI(index){
	var marriedI = [25,10,1,0];
	return marriedI[index];
}
function parseMisuseDrugs(index){
	var misuse_drugs = ["Yes", "No"];
	return misuse_drugs[index];
}
function misuse_drugs_importance(index){
	var misuse_drugs = ["Yes", "No", "No Preference"];
	return misuse_drugs[index];
}

function parsePets(index){
	var petsArr = ["Yes", "No"];
	return petsArr[index];
}
function petsI(index){
	var petsI = [25,10,1,0];
	return petsI[index];
}
function parseReligious(index){
	var religious = ["Yes", "No"];
	return religious[index];
}
function religiousI(index){
	var religious = [25,10,1,0];
	return religious[index];
}
function parseTobaccoUser(index){
	var tobacco = ["Yes", "No"];
	return tobacco[index];
}

function tobaccoI(index){
	var tabacco = ["Yes", "No", "No Preference"];
	return tabacco[index];
}
function parseWantKids(index){
	var wantKids = ["Yes", "No", "Not Sure"];
	return wantKids[index];
}
function wantKidsI(index){
	var wantKids = [25, 10, 1, 0];
	return wantKids[index];
}



function massLoad(){
	var index = 0;
	$.getJSON("myCompatibility.json", function(data){
		$.each(data, function(key, val){
			var user = val;
				firebase.firestore().collection("users").doc(user.uid).set({
					compatibility : {"married":user.married, "married_importance":user.married_importance, "have_kids":user.have_kids, "have_kids_importance":user.have_kids_importance,
								"want_kids":user.want_kids, "want_kids_importance":user.want_kids_importance, "tabacco_use":user.tabacco_use, "tabacco_use_importance":user.tabacco_use_importance,
								"marijuana_use":user.marijuana_use, "marijuana_use_importance":user.marijuana_use_importance, "drinker":user.drinker, "drinker_importance":user.drinker,
								"misuse_drugs":user.misuse_drugs, "misuse_drugs_importance":user.misuse_drugs_importance, "financially_stable":user.financially_stable,
								"financially_stable_importance":user.financially_stable_importance, "religious":user.religious, "religious_importance":user.religious_importance,
								"pets":user.pets, "pets_importance":user.pets_importance}
					/*profile: {"drinker":user.drinker, "ed_level":user.ed_level, "ethnicity":user.ethnicity, "ethnicity_importance":user.ethnicity_importance,
						  "family_importance":user.family_importance, "fin_stable":user.fin_stable, "have_kids":user.have_kids, "home_city":user.home_city,
							"home_country":user.home_country, "home_state":user.home_state, "job_company":user.job_company, "job_title":user.job_title,
							"languages":user.languages, "marital_status":user.marital_status, "political_view":user.political_view, "religion":user.religion,
							"school":user.school, "sex_importance":user.sex_importance, "smoker":user.smoker, "stability_importance":user.stability_importance,
						    "start_family":user.start_family, "subject":user.subject}*/
				}, { merge:true }).then(function(){
					index++;
					console.log("Dataset: "+index+" inserted");
				}).catch(function(error){
					alert(error.message);
				});
		});
	});
}
