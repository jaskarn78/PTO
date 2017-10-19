var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
console.log(userInfo);
var myId = userInfo.user_id;
var toId;
$(document).ready(function(){
	if(userInfo.profile_img.includes('https')!==false)
		$("#myAvatar").attr("src", decodeURIComponent(userInfo.profile_img));
	else $("#myAvatar").attr("src", "../../uploads/user_"+userInfo.user_id+"/"+userInfo.profile_img);
	$("#myAvatar").click(function(){
		window.location.href = "../setup/profile";
	});
	$("#myName").text(userInfo.first_name+" "+userInfo.last_name);
	getAllMatches();
	$("#texxt").keypress(function(e){
		if(e.keyCode == 13){
			sendMessage();
		 }
	});
	$(".send").click(function(){ sendMessage();});
	setInterval(getAllUnread,3000);

});


function sendMessage(){
	if(typeof(toId)!=="undefined"){
		var innerText = $.trim($("#texxt").val());
		if(innerText!==""){
			$(".messages").append("<li class=\"i\"><div class=\"head\"><span class=\"name\">"
				+userInfo.first_name+" "+userInfo.last_name+"</span><span class=\"time\">"+
				(new Date().getHours()) + ":"+(new Date().getMinutes())+
				" Today</span></div><div class=\"message\">"+$("#texxt").val()+"</div></li>");
			$.ajax({
				url:'../util/messaging.php',
				type:'POST',
				data:'send=true&myId='+myId+'&toId='+toId+'&msg='+innerText,
				dataType:'json',
			}).done(function(data){
				console.log(data);
			});
			$("#texxt").val("");
			$(".messages").resize();
			$(".messages").getNiceScroll(0);
		}
	}else
		alert("Please select recipient");
}

function getAllMatches(){
	$.ajax({
		url: '../util/messaging.php',
		type:'POST',
		data:'allMatches=true&userInfo='+JSON.stringify(userInfo),
		dataType:'json',	
	}).done(function(data){
		var matches = $("#list-matches");
		matches.append(data);
		$("#list-matches li").click(function(){
			var id = $.trim($(this).attr("id"));
			toId = id;
			getAllMessages();
			startChat();
		});
	});
}


function startChat(){
	$.ajax({
		url: '../util/messaging.php',
		type: 'POST',
		data: 'getUser=true&toId='+toId,
		dataType: 'json',
	}).done(function(data){
		console.log(data);
		var user = data;
		$("#chat-user").text(" "+user.first_name+" "+user.last_name);
		var profile_img = decodeURIComponent(user.profile_img);
		if(profile_img.includes('https')!==true)
			profile_img = "../../uploads/user_"+user.user_id+"/"+profile_img;
		$("#match-image").show();
		$("#match-image").attr("src", profile_img);
	});
}

function getAllMessages(){
	$.ajax({
		url: '../util/messaging.php',
		type: 'POST',
		data: 'getAllMessages=true&toId='+toId+'&myId='+myId,
		dataType: 'json',
	}).done(function(data){
		var chat = data;
		console.log(chat.length);
		if(chat.length!==0) $(".messages").append(chat);
		else $("#msgs").empty();
	});
}

function getAllUnread(){
	$.ajax({
		url: '../util/messaging.php',
		type: 'POST',
		data: 'unread=true&myId='+myId,
		dataType: 'json',
	}).done(function(data){
		var chat = data;
		console.log(chat.length);
		if(chat.length!==0) $(".messages").append(chat);
	});
}