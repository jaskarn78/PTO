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

function getAge(bday){
	var ageDiffMs = Date.now() - (new Date(bday)).getTime();
	var ageDate = new Date(ageDiffMs);
	return Math.abs(ageDate.getUTCFullYear()-1970);
}

function showLoader(){
	$("#myDiv").css("display","none");
	$("#loader").css("display","block");
}

function hideLoader(){
	$("#myDiv").css("display","block");
	$("#loader").css("display","none");
}