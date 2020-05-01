var uploadTask;
var strUploadedFile ="";
// Function to Upload the Files -- mariya
function upload()
{
    var fil = document.getElementById("filProfile");
	console.log('File to upload' + fil.files[0].name);
	uploadTask = storageRef.child('/profile/'+ fil.files[0].name).put(fil.files[0]);
		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on('state_changed', function(snapshot)
		{
		// Observe state change events such as progress, pause, and resume
		// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		console.log('Upload is ' + progress + '% done');
		switch (snapshot.state) 
		{
			case firebase.storage.TaskState.PAUSED: // or 'paused'
			console.log('Upload is paused');
			break;
			case firebase.storage.TaskState.RUNNING: // or 'running'
			console.log('Upload is running');
			break;
		}
		}, function(error) 
		{
		// Handle unsuccessful uploads
		}, function() 
		{
		// Handle successful uploads on complete
			uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) 
			{
				console.log('File available at', downloadURL);
				//-- Store in FireStore 	
				strUploadedFile = '<img style="width:200px; height:150px;border-radius: 0" src="'+ downloadURL +'">';
				newMessage();
			});
		});
	}
//------------------------------
// Function to Upload the Files before/without messages -- mariya
function BeforeSendingNewMessage()
{
	//-- if this is a FileUpload
	var fil = document.getElementById("filProfile");
	if (fil.files[0].name.length > 0)
	{
		//-- First upload the file
		upload();
	} else 
	{
		newMessage();
	}
}
// Function to create new messages -- mariya
function newMessage() {
	//-- If this is Just a text message
	
		message = $(".message-input input").val();
		if(($.trim(message) == '') && (document.getElementById("filProfile").files[0].name.length == 0 )) 
		{
			return false;
		}
		// var profileClick = "' + document.getElementById("ImgProfile").src + '"
		$('<li class="sent"><img src=' + document.getElementById("imgProfile").src + ' alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
		$('.message-input input').val(null);
		$('.contact.active .preview').html('<span>You: </span>' + message);
		// $(".messages").animate({ scrollTop: $(document).height() }, "fast");
		strUploadedFile = " --- " + strUploadedFile;
		db.collection("rooms").doc(roomId).collection("msgs").add({
  msg: message + strUploadedFile,
  msg_from: strUserId,
  msg_on: new Date().toLocaleString("en-GB"),
  msg_to: hidEmail
  
})
.then(function(docRef) {
	var objChatDiv = document.getElementById("divChatM");
	objChatDiv.scrollTop = objChatDiv.scrollHeight;
	getUserMsgs();	
	fcmSend(message);
})
//--To throw an alert if any error----mariya
.catch(function(error) {
  console.error("Error adding document: ", error);
}); 

	};

	//////////////////////////////////
	// $("btnSend").click(function() {
	// 	alert("btnSend");
	//   newMessage();
	// });
	
// To enable the Enter Key to send the message -- mariya
	$(window).on('keydown', function(e) {
	  if (e.which == 13) {
		newMessage();
		return false;
	  }
	});
