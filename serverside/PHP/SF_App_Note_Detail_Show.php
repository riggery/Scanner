<?php
	include 'connection.php';
	//require 'SF_DBConnection.php';

	$id=$_REQUEST[id];
	$sqlSentence="select * from sf_barcodenote WHERE";
	$sqlSentence = $sqlSentence . " note_id like '" . $id . "'";
	$res = mysql_query($sqlSentence);
	$fields_num = mysql_num_fields($res);
	//for($i=0;$i<$fields_num;$i++)
    //	echo mysql_field_name($res, $i); 
	$count=mysql_num_rows($res);
?>



	<?php
	while($rows=mysql_fetch_array($res)){
	?>

		<div data-role="content" class="ui-content" role="main">

    	<div class="article">
    		<?php echo "<p><img src='http://128.237.171.90/ScannerKitCode/upload/".$rows[note_img]."' alt='Pic' style='width: 260px; height: 260px;'></p>" ?>
    		<!--<p><img src="../../_assets/img/bike.jpg" alt="Pic"></p>-->

            <h2><?php echo $rows[note_sub]; ?></h2>

            <p><?php echo $rows[note_com]; ?></p>

       

		</div><!-- /article -->

    </div>

	<?php
	}
	?>

	<?php
		mysql_close();
	?>