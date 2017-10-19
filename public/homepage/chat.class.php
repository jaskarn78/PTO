<?php
	include('../Db.php');
	$db=new Db();

	
	if(isset($_POST['send'])){		
		$to      = $_POST['to'];
		$msg     = $_POST['msg'];
		$date    = date("Y-m-d H:i:s");
		$me 	 = $_POST['me'];
		$myImage = $_POST['my_image'];
		$query=("INSERT INTO chat(`id`, `sender_id`, `reciever_id`, `msg`, `time`)  VALUES(0,$me, $to,'$msg','$date')" );	
		$db->query($query);
		$dateTime = strtotime($date);
		$date = date('Y-m-d H:i:s', $dateTime);
		
		if(strlen($myImage)<20)
			$myImage='../uploads/user_'.$me.'/'.$myImage;
		$return_string['time']=$date;
		$return_string['output']="<span style='font-size:10px; color:black;margin-botton:10px;margin-left:35px;'> ".$date."</span><br><p><img src=".$myImage." class='circle' style='width:25px;height:25px;margin-right:10px;margin-top:-12px;'/>".$msg."</p>";
		echo json_encode($return_string);
	}
	
	if(isset($_POST['get_all_msg']) && isset($_POST['user'])){
		$return_string="";
		$set_unread="";
		$user 	 = $_POST['user'];
		$me   	 = $_POST['me'];
		$myImage = $_POST['my_image'];
		$query=("SELECT c.*, profile_img FROM chat as c USE INDEX (chat_index_combined) join profile on profile_id=c.sender_id ". 
			"WHERE ((sender_id = $me AND reciever_id = $user) OR (sender_id = $user AND reciever_id = $me)) ORDER BY (time) ASC;");
		$data=$db->select($query);
		foreach($data as $item){
			$class = "other";
			if($item['sender_id'] == $me) 
				$class = "me";
			$set_unread.="'".$item['id']."',";
			$dateTime = strtotime($item['time']);
			$senderImg=urldecode($item['profile_img']);
			if(strlen($item['profile_img'])<20)
				$senderImg='../uploads/user_'.$item['sender_id'].'/'.urldecode($item['profile_img']);
			else $senderImg = urldecode($item['profile_img']);
		
			$date = date('Y-m-d H:i:s', $dateTime);
			$return_string.="<span style='font-size:10px; color:black;margin-botton:10px;margin-left:35px;'> ".$date."</span><br>
			<p><img src=".$senderImg." class='circle' style='width:25px;height:25px;margin-right:10px;margin-top:-12px;'/>".$item['msg']."</p>";
		}
		$set_unread = trim($set_unread , ",");
		$db->query("UPDATE chat SET status=1 WHERE id IN($set_unread)");
		
		echo $return_string;
	}
	
	if(isset($_POST['unread'])){
		$return_string	= array();
		$set_unread		= "";
		$me 			= $_POST['me'];
		$myImage 		= urldecode($_POST['my_image']);
		$query="SELECT c.*, profile_img FROM chat as c USE INDEX (chat_index_reciever) join profile on profile_id=c.sender_id WHERE  reciever_id = $me AND status=0 ORDER BY (time) ASC;";
		$data = $db->select($query);

		foreach ($data as $item) {					
			$dateTime = strtotime($item['time']);
			$date 	  = date('Y-m-d H:i:s', $dateTime);
			$image 	  = urldecode($item['profile_img']);

			if(strlen($image)<20) 
				$image='../uploads/user_'.$item['sender_id'].'/'.$image;

			$return_string[$item['sender_id']]['output']="<span style='font-size:10px; color:black;margin-botton:10px;margin-left:35px;'> "
			.$date."</span><br><p><img src=".urldecode($image)." class='circle' style='width:25px;height:25px;margin-right:10px;margin-top:-12px;'/>".$item['msg']."</p>";
			$set_unread.="'".$item['id']."',";
		}
		$set_unread = trim($set_unread , ",");
		
		$db->query("UPDATE chat SET status=1 WHERE id IN($set_unread)");
		
		print json_encode($return_string);
	}
	
?>
