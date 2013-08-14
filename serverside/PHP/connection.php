<?php
	ob_start();
?>
<?php
	$dbhost='128.2.64.68';
	$dbuser='schemafu_Client';
	$dbpass='Shen@2012@yun';
	$db='schemafu_Tepper';
	$conn=mysql_connect($dbhost,$dbuser,$dbpass) or die ('cannot connect to db');
	mysql_select_db($db) or die ('no database');
	//echo "Sucessful Connection";
?>