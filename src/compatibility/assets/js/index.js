
$('.carousel.carousel-slider').carousel({fullWidth: true, noWrap: true});
$('.carousel.carousel-slider').css({"min-height":"100vh"});
$("#nextBtn").click(function(){
	$('.carousel.carousel-slider').carousel('next');
});
$("#backBtn").click(function(){
	$('.carousel.carousel-slider').carousel('prev');
});
$(document).ready(function(){


});