<?php
	include 'connection.php';
	//require 'SF_DBConnection.php';

	$key=$_REQUEST[key];
	$sqlSentence="select * from sf_barcodehistory WHERE";
	$sqlSentence = $sqlSentence . " taskId like '%" . $key . "%' ORDER BY id DESC";


	$res = mysql_query($sqlSentence);
	$fields_num = mysql_num_fields($res);
	$count=mysql_num_rows($res);
?>


	
	<?php
	$currentTaskId="";
	while($rows=mysql_fetch_array($res)){
		$taskId=$rows[taskId]; 

		if($taskId!=$currentTaskId){
	?>  
			<li data-role="list-divider" role="heading" class="ui-li ui-li-divider ui-bar-d ui-li-has-count"  style="text-decoration:none;"><?php echo $taskId ?></li>

	<?php
			$currentTaskId=$taskId;
		}
	?>


	<!--<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d">-->
	<?php echo "<li id=".$rows[id]." data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='d' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d'>"
	?>
		<div class="ui-btn-inner ui-li">
			<div class="ui-btn-text">
				<a href="index.html" class="ui-link-inherit">
					<p class="ui-li-aside ui-li-desc"><strong><?php echo $rows[time]; ?></strong>PM</p>
					<h3 class="topic ui-li-heading"><?php echo $rows[info]; ?></h3>
					<p class="ui-li-desc"><strong>Room Number:</strong><?php echo $rows[room]; ?></p>
				</a>
			</div>
		</div>
	
	</li>

	<?php
	}
	?>

	<?php
		mysql_close();
	?>