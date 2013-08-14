
//==============================================================================
//Play Notification Sound Module
//==============================================================================
function playSound() {
    document.getElementById('effectAudio').play();
}

//==============================================================================
//Local DB Module
//==============================================================================
var dbShell;
function doLog(s){
    setTimeout(function(){
               console.log(s);
               }, 3000);
}

function dbErrorHandler(err){
    alert("DB Error: "+err.message + "\nCode="+err.code);
}

function phoneReady(){
    doLog("phoneReady");
    //First, open our db
    dbShell = window.openDatabase("SimpleNotes", 2, "SimpleNotes", 1000000);
    //doLog("db was opened");
    //dropTable();
    console.log("db was opened");
    //run transaction to create initial tables
    dbShell.transaction(setupTable,dbErrorHandler,getEntries);
    doLog("ran setup");
}

function setupTable(tx){
    tx.executeSql("CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY,taskId,room,info,time)");
    doLog("setup table...");
}

function dropTable(){
    dbShell.transaction(function(tx) {
                        tx.executeSql("DROP TABLE notes",[],renderEntries,dbErrorHandler);
                        }, dbErrorHandler);
}


function clearTable(){
    dbShell.transaction(function(tx) {
                        tx.executeSql("DELETE FROM notes",[],renderEntries,dbErrorHandler);
                        }, dbErrorHandler);
}

function deleteById(id){
    dbShell.transaction(function(tx) {
                        tx.executeSql("DELETE FROM notes WHERE id="+id,[],renderEntries,dbErrorHandler);
                        }, dbErrorHandler);
}


function getEntries() {
    //doLog("get entries");
    dbShell.transaction(function(tx) {
                        tx.executeSql("select id, taskId, room, info, time from notes order by time desc",[],renderEntries,dbErrorHandler);
                        }, dbErrorHandler);
}

function getUploadEntries() {
    dbShell.transaction(function(tx) {
                        tx.executeSql("select id, taskId, room, info, time from notes order by time desc",[],uploadEntries,dbErrorHandler);
                        }, dbErrorHandler);
}


function renderEntries(tx, results) {
    //var len = results.rows.length;
    if (results.rows.length == 0) {
        $("#localScanList").html("<p>Currently no local records.</p>");
    }
    else
    {
        var msg="";
        for(var i=0; i<results.rows.length; i++) {
            msg=msg+"<li id="+results.rows.item(i).id+" data-corners='false' data-shadow='false' data-iconshadow='true' data-wrapperels='div' data-icon='arrow-r' data-iconpos='right' data-theme='d' class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d'>"+
            "<div class='ui-btn-inner ui-li'>"+
            "<div class='ui-btn-text'>"
            +"<a href='index.html' class='ui-link-inherit'>"
            +"<p class='ui-li-aside ui-li-desc'><strong>"+results.rows.item(i).time+"</strong></p>"
            +"<h3 class='topic ui-li-heading'>"+results.rows.item(i).info+"</h3>"
            +"<p class='ui-li-desc'><strong>Room Number:</strong>"+results.rows.item(i).room+"</p>"
            +"<p class='ui-li-desc'><strong>Task ID:</strong>"+results.rows.item(i).taskId+"</p>"+
            "</a>"
            +"</div>"
            +"</div>"
            +"</li>";
            
        }
        $("#localScanList").html(msg);
        $("#localScanList").listview("refresh");
    }
}


function uploadEntries(tx, results) {
    if (results.rows.length == 0) {
        //$("#localScanList").html("<p>Currently no local records.</p>");
        alert('Nothing to Submit')
    }
    else
    {
        //for(var i=0; i<results.rows.length; i++) {
        for(var i=results.rows.length-1;i>=0; i--) {
            //results.rows.item(0).id
            var id = results.rows.item(i).id;
            var taskId = results.rows.item(i).taskId;
            var info = results.rows.item(i).info;
            var room = results.rows.item(i).room;
            var time = results.rows.item(i).time;
            
            //doInsert(room,info,time);
            uploadItemAndDeleteLocal(id,taskId,room,info,time);
            //alert(id+info+name+time);
        }
    }
}



function saveNote(note, cb) {
    //Sometimes you may want to jot down something quickly....
    if(note.room == "") note.room = "[No Title]";
    dbShell.transaction(function(tx) {
                        tx.executeSql("insert into notes(taskId,room,info,time) values(?,?,?,?)",[note.taskId,note.room,note.info,note.time]);
                        }, dbErrorHandler,cb);
}

//===============================================
//AJAX Uploader for Local Database
//===============================================
//var ip='128.237.171.90';
function uploadItemAndDeleteLocal(id,taskId,room,info,time) {
    var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Scan_Create.php';
    $.ajax({
           url: url,
           data: "room="+room+"&barcode="+info+"&taskId="+taskId+"&time="+time,
           type: 'GET',
           success: function (resp) {
           //alert('upload');
           deleteItemLocalScanAfterUpload(id);
           },
           error: function(e) {
           alert('Error: '+e);
           }
           });
}


function deleteItemLocalScanAfterUpload(delItem) {
    dbShell.transaction(function(tx) {
                        tx.executeSql("DELETE FROM notes WHERE id="+delItem,[],
                                      renderEntries,dbErrorHandler);
                        }, dbErrorHandler);
}



//==============================================================================
//AJAX Mysql Module
//==============================================================================

function imageName(){
    var sub=$("#note_sub").val();
    sub = sub.replace(/[^\w]/gi, '');
    return sub;
}


function createRequestObject() {
    var ro;
    var browser = navigator.appName;
    if(browser == "Microsoft Internet Explorer"){
        ro = new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        ro = new XMLHttpRequest();
    }
    return ro;
}

var http = createRequestObject();

function sndReq(val) {
    http.open('get', val);
    http.onreadystatechange = handleResponse;
    http.send(null);
}

function handleResponse() {
    if(http.readyState == 4){
        var response = http.responseText;
        document.getElementById('response').innerHTML = http.responseText;
    }
}


//==============================================================================
//AJAX Mysql Module ------- Note & Scan History Show
//==============================================================================

function sndShowReq(val,content) {
    http.open('get', val);
    if(content=='note'){
        http.onreadystatechange = handleShowNoteResponse;
    }
    else{
        http.onreadystatechange = handleShowScanResponse;
    }
    http.send(null);
}

function handleShowScanResponse() {
    if(http.readyState == 4){
        var response = http.responseText;
        document.getElementById('histlist').innerHTML = http.responseText;
        console.log(response);
    } 
}


function handleShowNoteResponse() {
    if(http.readyState == 4){
        var response = http.responseText;
        document.getElementById('notelist').innerHTML = http.responseText;
        console.log(response);
    }
}


//var ip='128.237.171.90';
//var ip='schemafusion.com';
var ip='128.2.64.68';

function doInsert(room,val,taskId) {
    url1='http://'+ip+'/ScannerKitCode/PHP/SF_App_Scan_Create.php?room='+room+'&barcode='+val+'&taskId='+taskId;
    sndReq(url1);
}

function doScanShow() {
    var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Scan_Show.php';
    sndShowReq(url,'scan');
}

function doNoteShow() {
    var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Note_Show.php';
    sndShowReq(url,'note');
}



//==============================================================================
//Exit App Module
//==============================================================================
function exitFromApp()
{
    navigator.app.exitApp();
}





//==============================================================================
//AJAX Search Module 
//==============================================================================

function sendScanSearchKey(key) {
    var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Scan_Search.php';
    $.ajax({
           url: url,
           data: "key="+key,
           type: 'GET',
           success: function (resp) {
                //alert('search');
           //alert(resp);
                document.getElementById('histlist').innerHTML = resp;
           },
           error: function(e) {
           alert('Error: '+e);
           }
        });
}

//=====================================================
//AJAX Search for Scan Record
//=====================================================
function doScanSearch()
{
    var key=$('#scanFilterInput').val();
    //alert('click');
    sendScanSearchKey(key);
    
}



//==============================================================================
//AJAX Search Module
//==============================================================================

function sendNoteSearchKey(key) {
    var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Note_Search.php';
    $.ajax({
           url: url,
           data: "key="+key,
           type: 'GET',
           success: function (resp) {
           //alert('search');
           //alert(resp);
           document.getElementById('notelist').innerHTML = resp;
           },
           error: function(e) {
           alert('Error: '+e);
           }
           });
}

//=====================================================
//AJAX Search for Scan Record
//=====================================================
function doNoteSearch()
{
    var key=$('#noteFilterInput').val();
    //alert(key);
    sendNoteSearchKey(key);
    
}






//==============================================================================
//Window.onload
//==============================================================================
window.onload = function(){

    //==============================================================================
    //Initial Local Database
    //==============================================================================
    phoneReady();
    
    
    
    
    var initialScreenSize = window.innerHeight;
    window.addEventListener("resize", function() {
                            if(window.innerHeight < initialScreenSize){
                            $("[data-role=footer]").hide();
                            }
                            else{
                            $("[data-role=footer]").show();
                            }
                            });
    
    
    
    
    //==============================================================================
    //Stay on splashscreen when off-line
    //==============================================================================
    if(!(navigator.onLine))
    {
        alert("Offline! \n Please Check Connection or use Offline Mode");
        //window.close();
    }
    
    //==============================================================================
    //Swipe Delete Module
    //==============================================================================
    //==============================================================================
    //Local Scan History Delete
    //==============================================================================
    $(document).on("swipeleft swiperight", "#localScanList li.ui-li", function( event ) {
                   var listitem = $( this ),
                   dir = event.type === "swipeleft" ? "left" : "right",
                   transition = $.support.cssTransform3d ? dir : false;
                   confirmAndDeleteLocalScan(listitem,transition);
    });
    
    function confirmAndDeleteLocalScan(listitem,transition) {
        listitem.addClass( "ui-btn-down" );
        $( "#local-record-confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter("#local-record-question");
        $( "#local-record-confirm" ).popup( "open" );
        
        $( "#local-record-confirm #yes" ).on( "click", function() {
                                             //alert(listitem.attr('id'));
                                deleteItemLocalScan(listitem.attr('id'),listitem,transition);
                                });
        
        $( "#local-record-confirm #cancel" ).on( "click", function() {
                                   listitem.removeClass( "ui-btn-down" );
                                   $( "#local-record-confirm #yes" ).off();
                                   });
    }
    
    
    
    
    function errorCB(err) {
        alert("Error processing SQL: "+err);
    }
    
    function successCB() {
        alert("success!");
    }
    
    function deleteItemLocalScan(delItem,listitem,transition) {
        dbShell.transaction(
                function(tx) {
                            tx.executeSql("DELETE FROM notes WHERE id="+delItem);
                },errorCB,
                                    
                                  function () {
                                        if ( transition ) {
                                          listitem.removeClass( "ui-btn-down" )
                                          .addClass( transition )
                                          .on( "webkitTransitionEnd transitionend otransitionend", function() {
                                              listitem.remove();
                                              $("#localScanList").listview( "refresh" ).find( ".ui-li.border" ).removeClass( "border" );
                                              })
                                          .prev( "li.ui-li" ).addClass( "border" );
                                          }
                                        else {
                                            listitem.remove();
                                            $("#localScanList").listview( "refresh" );
                                          }
                            getEntries();
                                    }
        );
    }
    
    
    
    //==============================================================================
    //Scan History Delete
    //==============================================================================
    $(document).on("swipeleft swiperight", "#histlist li.ui-li", function( event ) {
        var listitem = $( this ),
        dir = event.type === "swipeleft" ? "left" : "right",
        transition = $.support.cssTransform3d ? dir : false;
        confirmAndDeleteScan(listitem,transition);
    });
    
    function confirmAndDeleteScan(listitem,transition) {
        listitem.addClass( "ui-btn-down" );
        $( "#scan-record-confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter("#scan-record-question");
        $( "#scan-record-confirm" ).popup( "open" );

        $( "#scan-record-confirm  #yes" ).on( "click", function() {
            deleteItemScan(listitem.attr('id'),listitem,transition);          
        });
        
        $( "#scan-record-confirm  #cancel" ).on( "click", function() {
            listitem.removeClass( "ui-btn-down" );
            $( "#scan-record-confirm  #yes" ).off();
        });
    }
    
    
    //==============================================================================
    //Use Jquery AJAX send Delete Request
    //==============================================================================
    
    function deleteItemScan(delItem,listitem,transition) {
        var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Scan_Delete.php';
        $.ajax({
               url: url,
               data: "deleteItem="+delItem,
               type: 'GET',
            success: function (resp) {
               if ( transition ) {
               listitem.removeClass( "ui-btn-down" )
               .addClass( transition )
               .on( "webkitTransitionEnd transitionend otransitionend", function() {
                   listitem.remove();
                   $( "#histlist" ).listview( "refresh" ).find( ".ui-li.border" ).removeClass( "border" );
                   })
               .prev( "li.ui-li" ).addClass( "border" );
               }
               else {
               listitem.remove();
               $( "#histlist" ).listview( "refresh" );
               }
            },
            error: function(e) {
                    alert('Error: '+e);
            }
        });
    }
    
    //==============================================================================
    //Note History Delete
    //==============================================================================
    $(document).on("swipeleft swiperight", "#notelist li.ui-li", function( event ) {
                   var listitem = $( this ),
                   dir = event.type === "swipeleft" ? "left" : "right",
                   transition = $.support.cssTransform3d ? dir : false;
                   confirmAndDeleteNote(listitem,transition);
    });
    
    function confirmAndDeleteNote(listitem,transition) {
        //alert('fdsa');
        listitem.addClass( "ui-btn-down" );
        $( "#note-record-confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter("#note-record-question");
        $( "#note-record-confirm" ).popup( "open" );
        
        $( "#note-record-confirm #yes" ).on( "click", function() {
                                //alert(listitem.attr('id'));
                                deleteItemNote(listitem.attr('id'),listitem,transition);
        });
        
        $( "#note-record-confirm #cancel" ).on( "click", function() {
                                   listitem.removeClass( "ui-btn-down" );
                                   $( "#note-record-confirm #yes" ).off();
        });

    }
    
    
    function deleteItemNote(delItem,listitem,transition) {
        var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Note_Delete.php';
        $.ajax({
               url: url,
               data: "deleteItem="+delItem,
               type: 'GET',
               success: function (resp) {
               if ( transition ) {
               listitem.removeClass( "ui-btn-down" )
               .addClass( transition )
               .on( "webkitTransitionEnd transitionend otransitionend", function() {
                   listitem.remove();
                   $( "#notelist" ).listview( "refresh" ).find( ".ui-li.border" ).removeClass( "border" );
                   })
               .prev( "li.ui-li" ).addClass( "border" );
               }
               else {
               listitem.remove();
               $( "#notelist" ).listview( "refresh" );
               }
               },
               error: function(e) {
               alert('Error: '+e);
               }
               });
    }

    
    
    
        
    //==============================================================================
    //Disable go button in case of refresh whole page
    //==============================================================================
    $("form").submit(function(){
                         return false;
    });
    
    
    $('#content').html($('#content_scan').html());
    $('#head').html($('#header_scan').html());
    var pictureSource;
    var destinationType;
    var pickUrl;
    var scanResult;
    var scanResultNote;
    //resultSpan = document.getElementById("scan-result");
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    //navigator.notification.alert("PhoneGap is working");

    
    //==============================================================================
    //Scanner Module
    //==============================================================================
    function scannerSuccess(result) {
        console.log("scannerSuccess: result: " + result)
        //resultSpan.innerText = "success: " + JSON.stringify(result)
        //scanResult=JSON.stringify(result.text);
        //alert(result.text);
        //doInsert(scanResult);
        //alert(typeof(scanResult));
        room=$("#room").val();
        taskId=$("#task").val();
        scanResult=result.text;
        if(scanResult!="")
           doInsert(room,scanResult,taskId);
    }
    
    
    function scannerSuccessLocal(result) {
        room_num=$("#offline_room").val();
        task_id=$("#offline_task").val();
        scan_time=getTime();
        scanResult=result.text;
        if(scanResult!="")
        {
            var data = {room:room_num,
            info:scanResult,
            taskId:task_id,
            time:scan_time,
            };
            saveNote(data,function() {
                 //alert('saved');
                 playSound();
                 document.getElementById('offline_response').innerHTML = scanResult+" in Room "+room_num+" has been checked";
                     });
        }
    }
    
    function scannerSuccessNote(result) {
        console.log("scannerSuccess: result: " + result)
        scanResultNote=result.text;
        //alert(scanResultNote);
        //if(scanResultNote!="")
        $('#note_barcode').val(scanResultNote);
    }
 
    function scannerFailure(message) {
        console.log("scannerFailure: message: " + message)
        resultSpan.innerText = "failure: " + JSON.stringify(message)
    }
    
    $('#scan-button').click(function(){
        var room=document.getElementById("room");
        var task=document.getElementById("task");
        if(empty_validation(task,"Task ID")){

        if(empty_validation(room,"Room Number"))
            window.plugins.barcodeScanner.scan(scannerSuccess, scannerFailure);
        }
    });
    
    
    
    //offlineScan-button
    $('#offlineScan-button').click(function(){
            var room=document.getElementById("offline_room");
            var task=document.getElementById("offline_task");
            if(empty_validation(task,"Task ID")){
                    if(empty_validation(room,"Room Number"))
                                   {window.plugins.barcodeScanner.scan(scannerSuccessLocal, scannerFailure);
                                   }
            }
    });
    //=========================================================================
    //Note scan part
    //-------------------------------------------------------------------------
    
    $('#note_barcode').click(function(){
         window.plugins.barcodeScanner.scan(scannerSuccessNote, scannerFailure);
    });
    
    
    
    //------------------------------------------------------------------------------
    //Back to Broswer Module
    //==============================================================================
    $('#switch-button').click(function(){
        window.open("http://128.2.64.68/SFGUI.php", '_system');
    });
    //==============================================================================
    //Take & Upload Image Module
    //==============================================================================
    function fromCamera(source){
        navigator.camera.getPicture(function(imageURI){
            var largeImage = document.getElementById('smallImage');
            largeImage.style.display = 'block';
            largeImage.src = imageURI;
            pickUrl = imageURI;
        }, function(){
            if(source==pictureSource.CAMERA)
                console.log('Load camara error!');
            else
                console.log('Load photo error!');
            }, {
                quality : 50,
                destinationType : destinationType.FILE_URI,
                sourceType : source
        });
    }
    
    
    var submit_flag=1;
 
    function uploadFile(file_Name) {
        var subject=$("#note_sub").val();
        var coment=$("#coment").val();
        var barcode=$('#note_barcode').val();
        var imageURI = pickUrl;
        if(!imageURI)
            alert('Select image please');
        var options = new FileUploadOptions();
        options.fileKey = "image";
        //options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.fileName = file_Name+'.png';
        options.mimeType = "image/jpeg";
        var ft = new FileTransfer();
        ft.upload(
                  imageURI,
                  encodeURI('http://'+ip+'/ScannerKitCode/PHP/SF_App_Note_Upload.php?coment='+coment+'&subject='+subject+'&barcode='+barcode),
                  function(){ alert('Upload Successfully!');submit_flag=1;emptyInput();playSound();},
                  function(){ alert('Upload Fail!');submit_flag=1;},
                  options);
    }
    
    
    //==============================================================================
    //Get Time on client side
    //==============================================================================
    function getTime() {
		var currentdate = new Date();
		var datetime = (currentdate.getMonth()+1)+"-"+currentdate.getDate()+"-"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes();
		return datetime;
	}
    
	//==============================================================================
    //Form Empty Validation
    //==============================================================================
    function empty_validation(content,name){
        var content_len = content.value.length;
        if (content_len == 0)
        {
            alert(name+" must be fill out");
            content.focus();
            return false;
        }
        return true;
    }
    
    //==============================================================================
    //Empty Input Content After Sucessfully Submit
    //==============================================================================
    function emptyInput(){
        $('#note_sub').val('');
        $('#note_barcode').val('');
        $('#coment').val('');
        $('#smallImage').replaceWith('<img style="width: 160px; height: 160px;" id="smallImage" src="" />');
        $('#smallImage').hide();
    }
    
    
    

    
    //==============================================================================
    //Key Group
    //==============================================================================
    $('#photo-button').click(function(){
        fromCamera(pictureSource.PHOTOLIBRARY);
    });
    
    $('#take-button').click(function(){
        fromCamera(pictureSource.CAMERA);
    });
    
    
    $('#upload-button').click(function(){
    if(submit_flag==1){
        var file_Name=imageName();
        if(file_Name==''){
            alert('Input Subject')
        }
        else{
            submit_flag=0;
            uploadFile(file_Name);
        }
    }
    });
    
    
  
    
    $('#test2-button').click(function(){
        //alert('clicked');
        exitFromApp();
    });
    
    
    
    
    //==============================================================================
    //Local DB Write
    //==============================================================================
        $("#SubmitButton").on('click',function() {
                          //alert('save');
                          var data = {room:$("#noteTitle").val(),
                          info:$("#noteBody").val(),
                          //id:$("#noteId").val()
                          };
                          //alert(data.room+data.info);
                          saveNote(data,function() {
                                   //alert('saved');
                                   document.getElementById('offline_response').innerHTML = "saved";
                                   //$.mobile.changePage("index.html",{reverse:true});
                                   });
                          });

    
    
    
    //==============================================================================
    //Listview Click to Detail Module
    //==============================================================================
    

    
    $('#notelist').on('click', 'li', function() {
                      //alert("Works"); // id of clicked li by directly accessing DOMElement property
                      var listitem = $( this );
                      var id=listitem.attr('id');
                      sendIdforDetail(id);
                      //info-content
    });
    
    $('#back').on('click', function() {
                  
                      $(".scanner-content").hide();
                      $(".scanner-header").hide();
                      $(".footer").show();
                      //$("#note-content").show();
                      $("#note-header").show();
                  $('#note-record-content').show();
                  doNoteShow();
                      //info-content
    });
    

    
    function sendIdforDetail(id) {
        var url='http://'+ip+'/ScannerKitCode/PHP/SF_App_Note_Detail_Show.php';
        $.ajax({
               url: url,
               data: "id="+id,
               type: 'GET',
               success: function (resp) {
               //alert('search');
               //alert(resp);
               document.getElementById('detailDiv').innerHTML = resp;
               $(".scanner-content").hide();
               $(".scanner-header").hide();
               $(".footer").hide();
               $("#info-content").show();
               $("#info-header").show();
               },
               error: function(e) {
               alert('Error: '+e);
               }
               });
    }
    
    
    
    
    
    //==============================================================================
    //Tab Trans Control Group
    //==============================================================================
    
   
    
    
    $("#backLogInOnLine").click(function(){
                                $(".scanner-content").hide();
                                $(".scanner-header").hide();
                                $(".footer").hide();
                                $("#login-header").show();
                                $("#login-content").show();
                                });
    
    
    $("#backLogInOffLine").click(function(){
                                 $(".scanner-content").hide();
                                 $(".scanner-header").hide();
                                 $(".footer").hide();
                                 $("#login-header").show();
                                 $("#login-content").show();
                                 });
    
    
    
    $("#login-button").click(function(){
                             $(".scanner-content").hide();
                             $(".scanner-header").hide();
                             $("#localscan-header").show();
                             $("#offlineScan-content").show();
                             $(".footer").show();
                             });
    
    $("#offline-button").click(function(){
                               $(".scanner-content").hide();
                               $(".scanner-header").hide();
                               $("#offline-header").show();
                               $("#offlineScan-content").show();
                               
                               });
    
    
    
    //$("#note_record").click(function(){
    //   $("#note-content").show();
    //});
    
    
    $(".scanner-footer").click(function(){
                               $(".scanner-content").hide();
                               $(".scanner-header").hide();
                               var pageSelected = this.id;
                               var headerSelected = pageSelected + "-header";
                               var contentSelected = pageSelected + "-content";
                               $("#" + headerSelected).show();
                               $("#" + contentSelected).show();
                               });
    
    //});
    
    
    
    $('#scan').on('click', function() {
                  $(this).removeClass('ui-btn-active');
                  
                  });
    
    $('#localscan').on('click', function() {
                     $(".scanner-content").hide();
                     //$("#offineScan-record-content").show();
                     //getEntries();
                          $(this).removeClass('ui-btn-active');
                     $("#offlineScan-content").show();
                  

                     
                     });
   
    $('#scanhistory').on('click', function() {
                       $(".scanner-content").hide();
                       $('#scan-record-header').show();
                       $('#scan-record-content').show();
                       doScanShow();
                       $(this).removeClass('ui-btn-active');
    
                       });




    $('#note').on('click', function() {
                  $('#smallImage').hide();
                  $(this).removeClass('ui-btn-active');
    });
    
    $('#note_record').on('click', function() {
                         $(".scanner-content").hide();
                         $('#note-record-content').show();
                         doNoteShow();
                         $(this).removeClass('ui-btn-active');
                         
                         });
    
    $('#note_add').on('click', function() {
                      $(".scanner-content").hide();
                      $('#note-content').show();
                      $(this).removeClass('ui-btn-active');
                      });
    
    $('#scan_record').on('click', function() {
                         $(".scanner-content").hide();
                         $('#scan-record-content').show();
                         doScanShow();
                         $(this).removeClass('ui-btn-active');
                         });
    
    $('#scan_add').on('click', function() {
                      $(".scanner-content").hide();
                      $('#scan-content').show();
                      $(this).removeClass('ui-btn-active');
                      });
    
    
    $('#offlineScanOffline_record').on('click', function() {
                                $(".scanner-content").hide();
                                $("#offineScan-record-content").show();
                                getEntries();
                                //doScanShow();
                                       $(this).removeClass('ui-btn-active');
                                });
    
    $('#offlineScanOffline_add').on('click', function() {
                             $(".scanner-content").hide();
                             $("#offlineScan-content").show();
                                    $(this).removeClass('ui-btn-active');
                             });
    
    $('#offlineScanOnline_record').on('click', function() {
                                       $(".scanner-content").hide();
                                       $("#offineScan-record-content").show();
                                       getEntries();
                                       //doScanShow();
                                      $(this).removeClass('ui-btn-active');
                                       });
    
    $('#offlineScanOnline_add').on('click', function() {
                                    $(".scanner-content").hide();
                                    $("#offlineScan-content").show();
                                   $(this).removeClass('ui-btn-active');
                                    });
    
    
    
    $("#offLineSubmitBtn").on('click', function() {
                              //alert('upload');
                              getUploadEntries();
                              $(this).removeClass('ui-btn-active');
                              });
}