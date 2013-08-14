<?php
  //$dbhost='localhost';
  //$dbuser='root';
  //$dbpass='11989';
  //$db='qrinfo';
  //$conn=mysql_connect($dbhost,$dbuser,$dbpass) or die ('cannot connect to db');
  //mysql_select_db($db) or die ('no database');
  include 'connection.php';

  //$uploadpath='/webcontent/ScannerKitCode/upload/';
  $uploadpath='../upload/';
  $linkpath='/upload/';
  $coment=$_REQUEST[coment];
  $subject=$_REQUEST[subject];
  $barcode=$_REQUEST[barcode];
  $time=date('m-d-Y');


  if (!empty($_FILES["image"])){
    $file_name=$_FILES['image']['name'];
    $file_type=$_FILES['image']['type'];
    $file_temp=$_FILES['image']['tmp_name'];
    $file_size=$_FILES['image']['size'];
    //echo "File names : ".$file_name."<br>";
    //echo "File type : ".$file_type."<br>";
    //echo "File temp names : ".$file_temp."<br>";
    //echo "File size : ".$file_name."<br>";
    $ext = substr(strrchr($file_name, "."), 1); 
    //echo "ext : ".$ext."<br>";
    //echo "Server Path : ".$store."<br>";
    //echo "Database Path".$link."<br>";


      // ensure a safe filename
      $file_name = preg_replace("/[^A-Z0-9._-]/i", "_", $file_name);
      $i = 0;
      $parts = pathinfo($file_name);
      while (file_exists($uploadpath.$file_name)) {
          $i++;
          $file_name = $parts["filename"] . "-" . $i . "." . $parts["extension"];
      }

    //echo "<p>".$file_name."</p>";
      $link=$linkpath.$file_name;
      $store=$uploadpath.$file_name;
    
    if(substr($file_type,0,5)=='image'){
      echo "work";
      
      //if(mysql_query("INSERT INTO sf_barcodenote (note_id, note_img, note_link, note_com) VALUES (NULL,'$file_name','$link','helloworld')"))
      if(mysql_query("INSERT INTO sf_barcodenote (note_id, note_img, note_link, note_sub, note_com,note_barcode,note_time) VALUES (NULL,'$file_name','$link','$subject','$coment','$barcode','$time')"))
      {
        echo 'db';
      }
      if(move_uploaded_file($_FILES['image']['tmp_name'], $store)){
          echo "server~";
      }
    }
    else{
      echo "Please select image file";
    }
  }
  else{
    echo "empty";
  }
?>