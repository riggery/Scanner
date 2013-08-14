
<?php
	include 'connection.php';
	$room=$_REQUEST[room];
	$barcode=$_REQUEST[barcode];
	$taskId=$_REQUEST[taskId];
	//$discription=$_REQUEST[discription];
	$raw=date('l')." ".date('m-d-Y H:i');
	//$xplod=explode(' ',$raw);
	//$time=$xplod[2];
	$res = mysql_query('select * from sf_barcodehistory');
	$fields_num = mysql_num_fields($res);
	//for($i=0;$i<$fields_num;$i++)
    //	echo mysql_field_name($res, $i); 
	$count=mysql_num_rows($res);
	mysql_query("INSERT INTO sf_barcodehistory (id,taskId,room,info,time) VALUES (NULL,'$taskId','$room','$barcode','$raw')");
	//echo 'Crew has been added!';
?>

<p><?php echo $barcode." in Room".$room ?> has been checked</p>

