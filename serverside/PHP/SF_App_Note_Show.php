<?php
	include 'connection.php';
	//require 'SF_DBConnection.php';
	$res = mysql_query('select * from sf_barcodenote');
	$fields_num = mysql_num_fields($res);
	//for($i=0;$i<$fields_num;$i++)
    //	echo mysql_field_name($res, $i); 
	$count=mysql_num_rows($res);
?>



	<?php
	while($rows=mysql_fetch_array($res)){
	?>

		<?php echo "<li id=".$rows[note_id]." data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' 
		data-theme='c' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-li-has-thumb ui-btn-up-c'>" ?>
				<div class="ui-btn-inner ui-li">
					<div class="ui-btn-text">
						<a href="index.html" class="ui-link-inherit">
						<!--<img src='http://128.237.171.90/ScannerKitCode/upload/first.png' class='ui-li-thumb'>-->
						<?php echo "<img src='http://128.237.171.90/ScannerKitCode/upload/".$rows[note_img]."' class='ui-li-thumb'>" ?>
						<p class="ui-li-aside ui-li-desc"><strong><?php echo $rows[note_time]; ?></strong></p>
						<h3 class="ui-li-heading"><?php echo $rows[note_sub]; ?></h3>
						<p class="ui-li-desc"><?php echo $rows[note_com]; ?></p>
						<!--<p class="ui-li-desc"><?php echo $rows[note_img]; ?></p>-->

					</a>
					</div>
					<span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>
				</div>
		</li>
	

	<?php
	}
	?>

	<?php
		mysql_close();
	?>