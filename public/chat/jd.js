$(document).ready(function(){
	var userInfo = JSON.parse(sessionStorage.getItem("userData"));
	var me = userInfo.uid;
	var my_image = userInfo.photoURL;
	var open=Array();
	var date = new Date();
	var curDate = (date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	$("#jd-chat").delegate(".jd-online_user", "click", function(){
		var user_name = $.trim($(this).text());
		var id = $.trim($(this).attr("id"));
		
		if($.inArray(id,open) !== -1 )
			return
		
		open.push(id);
	
		$("#jd-chat").prepend('<div class="jd-user">\
			<div class="jd-header" id="' + id + '">' + user_name + '<span class="close-this"> X </span></div>\
			<div class="jd-body" id="jd-body"></div>\
			<div class="jd-footer"><input id="chatInput" placeholder="Write A Message"></div>\
		</div>');
		/*$.ajax({
			url:'chat.class.php',
			type:'POST',
			data:'get_all_msg=true&user=' +id+'&me='+userInfo.user_id+'&my_image='+decodeURIComponent(userInfo.profile_img),
			success:function(data){
				$("#jd-chat").find(".jd-user:first .jd-body").append("<span class='me'> " + data +"</span>");
			}
		});*/
	});
	
	$("#jd-chat").delegate(".close-this","click",function(){
		removeItem = $(this).parents(".jd-header").attr("id");
		$(this).parents(".jd-user").remove();
		
		open = $.grep(open, function(value) {
		  return value != removeItem;
		});	
	});
		
	$("#jd-chat").delegate(".jd-header","click",function(){
		var box=$(this).parents(".jd-user,.jd-online");
		$(box).find(".jd-body,.jd-footer").slideToggle();
	});
	
	$("#search_chat").keyup(function(){
		var val =  $.trim($(this).val());
		$(".jd-online .jd-body").find("span").each(function(){
			if ($(this).text().search(new RegExp(val, "i")) < 0 ) 
                $(this).fadeOut(); 
			else 
                $(this).show();              
		});
	});
	
	$("#jd-chat").delegate(".jd-user input","keyup",function(e){
		if(e.keyCode == 13 )
		{
			var box=$(this).parents(".jd-user");
			var msg=$(box).find("input").val();
			var input = document.getElementById("chatInput");
			var to = $.trim($(box).find(".jd-header").attr("id"));
			/*$.ajax({
				url:'chat.class.php',
				type:'POST',
				data:'send=true&to=' + to + '&msg=' + msg+'&me='+userInfo.user_id+'&my_image='+userInfo.profile_img,
				success:function(data){
					var obj = JSON.parse(data);
					//alert(obj.output);
					//$(box).find(".jd-body").append(date);
					$(box).find(".jd-body").append(obj.output);

					input.value='';
					
				}

			});*/
		}
	});
	
	function message_cycle()
	{
		/*var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
		$.ajax({
			url:'chat.class.php',
			type:'POST',
			data:'unread=true&me='+userInfo.user_id+'&my_image='+userInfo.profile_img,
			dataType:'JSON',
			success:function(data){
				$.each(data , function( index, obj ) {
					var user = index;					
					var box  = $("#jd-chat").find("div#2").parents(".jd-user");
					var chatbody = document.getElementById("jd-body");
					var span = document.createElement("p");
					var dateSpan = document.createElement("span");
					$(".jd-online").find(".light").hide();
					$.each(obj, function( key, value ) {
						if($.inArray(user,open) !== -1 ){	
							dateSpan.class="date";
							dateSpan.innerHTML=curDate;
							$(box).find(".jd-body").append(obj.output);
							span.class="other";
							span.innerHTML=obj.output;
							chatbody.appendChild(span);
							//chatbody.append(obj.output);
						}						
						else{						
							$(".jd-online").find("span#" + user + " .light").show();
						}


					});
				});				
			}
		});*/
	}
	
	
	//setInterval(message_cycle,3000);
});  
