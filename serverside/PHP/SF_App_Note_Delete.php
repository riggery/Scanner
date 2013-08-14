<?php
header('Content-type: text/html');
header('Access-Control-Allow-Origin: *');

  include 'connection.php';
  $id=$_GET['deleteItem'];
  $result=mysql_query("Delete from sf_barcodenote where note_id=$id");
  //$table=$_GET['table'];
  //$result=mysql_query("Delete from barcodedata where id=$id");
  //if($table=="barcodedata"){
  //{
  	//$result=mysql_query("Delete from $table where id=$id");
  //}
  //else if($table=="note"){
    //$result=mysql_query("Delete from $table where note_id=$id");
  //}
  
  echo $result;
  //echo $table
?>