$(document).ready(function(){
	setupPayPal();
	showLoader();
	$("#completeBtn").click(function(event){
		showLoader();
		event.preventDefaults;
		
	});

	var nonce = get("payment_method_nonce");
	if(nonce !== 'undefined')
		sendData(nonce);

});

function sendData(nonce){
	var mydata= "";
	var url = "/post";
	$.ajax({
		type: "POST",
		url: url,
		data: "payment_method_nonce="+nonce+"&cost=204.00",
		success:function(data){
			if(data.transaction != null){
				var cardtype = data.transaction.creditCard.cardType;
				var maskedNumber = data.transaction.creditCard.maskedNumber;
				var chargedAt = data.transaction.createdAt;
				hideLoader(); alert(cardtype+" "+maskedNumber+"\nCharged at "+chargedAt+" for the amount: $"+data.transaction.amount);
			}
		}
	});
	return mydata;
}

function setupPayPal(){
	 braintree.setup("sandbox_3x3pcbhm_xbp5d3kvwgdw87rr", "custom", {id: "checkout"});
        
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}