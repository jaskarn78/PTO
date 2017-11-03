var data = getUserData();
getToken(data);
var code = "DkWeb25";
var formComplete = false;
var totalCost;
$(document).ready(function(){
	$("#completeBtn").attr("disabled", true);
	validateInput();
	$("#completeBtn").click(function(event){
		event.preventDefaults;
	});
	$(document).ajaxStart(function(){
	    $("#loader").show();
	});
	$(document).ajaxComplete(function(){
	    $("#loader").hide();
	});

});

function validateInput(){
	var checked = false;
	$("#termsCheckbox").on("change", function(){
		if($("#termsCheckbox").is(":checked"))
			$("#completeBtn").attr("disabled", false);
		else $("#completeBtn").attr("disabled", true);
	});

}

function getUserData(){
	if(sessionStorage.getItem("userData") != null){
		var data = JSON.parse(sessionStorage.getItem("userData"));
		setKnownData(data);
		setCheckBoxListener(data);
		return data;
	}
	else window.location.href = '../signup';
}

function setKnownData(data){
	$("#planType").text(parsePlans(data.userData.plan.type));

	var planCost = data.userData.plan.cost;
	var totalCost = parseFloat(Math.round((planCost+0.00) * 100) / 100).toFixed(2);

	data.userData.plan.totalCost = totalCost;
	setupDiscountBtn(data);

	$("#planCost").text("$"+planCost);
	$("#subtotal").text("$"+planCost);
	$("#taxes").text("$0.00");

	var data = JSON.parse(sessionStorage.getItem("userData"));
	if(data.userData.plan.discountApplied){
		$("#discountList").show();
		$("#discountApproved").text("$"+data.userData.plan.discountAmount);
		$("#discountCode").val(data.userData.plan.discountCode);
		$("#total").text(data.userData.plan.totalCost);
	} else $("#total").text(totalCost);

	storeData(data);

}

function setupDiscountBtn(data){
	var cost = data.userData.plan.totalCost;
	data.userData.plan.discountApplied = false;
	$("#discountCodeBtn").on("click", function(){
		var discountCode = $("#discountCode").val();
		if(discountCode === code && data.userData.plan.discountApplied==false){
			var totalDiscount = parseFloat(Math.round((0.25 * cost) * 100) / 100).toFixed(2);
			$("#discountList").show();
			$("#discountApproved").text("$"+totalDiscount);
			totalCost = parseFloat(Math.round((cost - totalDiscount) * 100) / 100).toFixed(2);
			data.userData.plan.totalCost = totalCost;
			data.userData.plan.discountApplied = true;
			data.userData.plan.discountAmount = totalDiscount;
			data.userData.plan.discountCode = code;
			$("#total").text(totalCost);
			storeData(data);
			alert("Discount code applied");
		}else if(data.userData.plan.discountApplied)
			alert("Discount already applied");
		else alert("Invalid discount code");
	});
}

function storeData(data){
	sessionStorage.setItem("userData", JSON.stringify(data));
}

function setCheckBoxListener(data){
	var userInfo = data.userData;
	$("#autoFill").on("change", function(){
		if($("#autoFill").is(":checked")){
			var nameArr = userInfo.name.split(' ');
			setData(nameArr, userInfo.city, userInfo.state, userInfo.zip);
		}else clearData();
	})
}

function setData(name, city, state, zip){
	$("#name").val(name[0]+' '+name[1]);
	$("#first_name").val(name[0]);
	$("#last_name").val(name[1]);
	$("#city").val(city);
	$("#state").val(state);
	$("#zip").val(zip);
}
function clearData(){
	$("#name").val('');
	$("#first_name").val('');
	$("#last_name").val('');
	$("#city").val('');
	$("#state").val('');
	$("#zip").val('');
}

function sendData(nonce, totalCost){
	var url = "/post";
	$.ajax({
		type: "POST", url: url,
		data: "payment_method_nonce="+nonce+"&cost="+totalCost,
		success:function(data){}
	}).done(function(data){
		if(data.transaction != null){
			alert("Charged for the amount: $"+data.transaction.amount);
			sendVerificationEmail();
		}
	}).catch(function(err){
		console.log(err);
	});
}

function getToken(userData){
	$.ajax({ type: "GET", url: "/checkout"
	}).done(function(data){ setupPayment(data, userData); });
}

function setupPayment(token, data){
	var userData = data.userData;
	braintree.setup(token, "custom", 
	{
		id: "checkout",
		paypal: {
			container: "paypal-button",
			singleUse: true, // Required
			amount: parseFloat($("#total").text()), // Required
			currency: 'USD', // Required
			intent: 'sale',
			submitForSettlement: true,
			locale: 'en_US',
			enableShippingAddress: true,
			shippingAddressOverride: {
				recipientName: 'Scruff McGruff',
				streetAddress: '1234 Main St.',
				extendedAddress: 'Unit 1',
				locality: 'Chicago',
				countryCodeAlpha2: 'US',
				postalCode: '60652',
				region: 'IL',
				phone: '123.456.7890',
				editable: false
			}
		},
		onPaymentMethodReceived: function (obj) {
			sendData(obj.nonce, $("#total").text());
		}
	});	
}

function sendVerificationEmail(){
	var firebaseUser = firebase.auth().currentUser;
	firebaseUser.sendEmailVerification().then(function(){
		//Email sent
		alert("Check email for account activation");
		goToNext();
	}).catch(function(error){
		//Error occured
	});
}

function goToNext(){
	window.location.href='../AddImage';
}
	
function parsePlans(plan){
	switch(plan){
		case "0" : return "Free Trial";
		case "1" : return "1 Month Subscription";
		case "3" : return "3 Month Subscription";
		case "6" : return "6 Month Subscription";
		case "9" : return "9 Month Subscription";
		case "12": return "12 Month Subscription";

	}
}

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}