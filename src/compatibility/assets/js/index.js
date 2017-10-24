var index=1;
$('.carousel.carousel-slider').carousel({fullWidth: true, noWrap: true});
$('.carousel.carousel-slider').css({"min-height":"100vh"});

$(document).ready(function(){
	$("#nextBtn").click(function(){
		if(index<9){
			$('.carousel.carousel-slider').carousel('next');
			index+=1;
		}
		if(index+1==10){
			$("#nextBtn").text("Done");
			$("#nextBtn").attr("id", "doneBtn");
			$("#backBtn").css({"display":"none"});
			$("#doneBtn").click(function(){
				getResults();
			});
		}
	});
	$("#backBtn").click(function(){
		if(index>=2){
			index--;
			console.log(index);
			$('.carousel.carousel-slider').carousel('prev');
		}

	});


});

function getResults(){
	var compatibility = {};
	compatibility.relationship_status 				= parseInt($("#relationship_status").val());
	compatibility.get_married 		  				= parseInt($("#get_married").val());
	compatibility.get_married_importance 			= parseInt($("#get_married_importance").val());
	compatibility.have_kids 						= parseInt($("#have_kids").val());
	compatibility.have_kids_importance 				= parseInt($("#have_kids_importance").val());
	compatibility.want_kids 						= parseInt($("#want_kids").val());
	compatibility.want_kids_importance 				= parseInt($("#want_kids_importance").val());
	compatibility.use_tobacco 						= parseInt($("#use_tobacco").val());
	compatibility.use_tabacoo_importance 			= parseInt($("#use_tabacoo_importance").val());
	compatibility.drink 							= parseInt($("#drink").val());
	compatibility.drink_importance 					= parseInt($("#drink_importance").val());
	compatibility.use_marijuana 					= parseInt($("#use_marijuana").val());
	compatibility.use_marijuana_importance 			= parseInt($("#use_marijuana_importance").val());
	compatibility.misuse_drugs 						= parseInt($("#misuse_drugs").val());
	compatibility.misuse_drugs_importance 			= parseInt($("#misuse_drugs_importance").val());
	compatibility.financially_stable 				= parseInt($("financially_stable").val());
	compatibility.financially_stable_importance 	= parseInt($("#financially_stable_importance").val());
	compatibility.education_level 					= parseInt($("#education_level").val());
	compatibility.education_level_importance 		= parseInt($("#education_level_importance").val());
	compatibility.political_affiliation 			= parseInt($("#political_affiliation").val());
	compatibility.political_affiliation_importance 	= parseInt($("#political_affiliation_importance").val());
	compatibility.religious 						= parseInt($("#religious").val());
	compatibility.religious_importance 				= parseInt($("#religious_importance").val());
	compatibility.spiritual 						= parseInt($("#spiritual").val());
	compatibility.spiritual_importance 				= parseInt($("#spiritual_importance").val());
	compatibility.sex_frequency 					= parseInt($("sex_frequency").val());
	compatibility.sex_frequency_importance 			= parseInt($("#sex_frequency_importance").val());
	compatibility.cheating 							= parseInt($("#cheating").val());
	compatibility.cheating_importance 				= parseInt($("#cheating_importance").val());
	compatibility.pets 								= parseInt($("#pets").val());
	compatibility.pets_importance 					= parseInt($("#pets_importance").val());
	compatibility.traveling 						= parseInt($("#traveling").val());
	compatibility.traveling_importance 				= parseInt($("#traveling_importance").val());
	compatibility.body_mods 						= parseInt($("#body_mods").val());
	compatibility.body_mods_importance 				= parseInt($("#body_mods_importance").val());
	console.log(compatibility);
}