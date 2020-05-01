function fcmSend(strMsg)
{
    // POST request using fetch() - mariya
fetch("https://fcm.googleapis.com/fcm/send", { 
      
      // Adding method type - mariya
      method: "POST", 
        
      // Adding body or contents to send - mariya 
      body: JSON.stringify(
      {
  "priority":"HIGH",
  "data":{
      "title": "Msg from : " + strUserId,
      "body": strMsg
  },
  "to": hidToToken
      }        
      ), 
        
      // Adding headers to the request - mariya 
      headers: { 
        "Content-type": "application/json",
        "Authorization": "key=AAAAC3c9nic:APA91bHefJm8r52TvDzfa-GppbisBNm5JRGOb8DcQL6l9e8b10uXx16Scxdl7tkQUHq06ESZFMTekRsD34NXL5nZHWA-GJcUkdb2lHZceQRZ1VJFTnBt_Jc8txLYyKyWCeufAOSnahcD"
      } 
  }) 

  .then(function(response){
      var objJson = response.json();
      console.log(objJson);
  });

  // // Converting to JSON - mariya
  // .then(response => response.json())     
  // // Displaying results to console 
  // .then(json => console.log(json)); 
}
//-----------------------------

	//--To connect firebase with firestore declare an variable-----mariya
	var db = firebase.firestore();
	//--To get the list as key, Value, key & Value with required data-----mariya

var strUserId="";
var listener;
//--Function to the List of the Chat Users-----mariya
function getList()
{
	var docRef = db.collection("Chat").doc(objUser.email);
docRef.get().then(function(doc) {
    if (doc.exists) {
		strUserId=doc.id;
		document.getElementById("imgProfile").src=doc.data().ProfileImg;
		document.getElementById("spnDispName").innerHTML=doc.data().DisplayName;

	} else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
//-------------------------------------------------
// var arrUserId = [];
// var string=strUserId;
// alert(strUserId("user1").charAt(0)); 
// alert(arrUserId = strUserId("user1").charAt(0).sort());
var docs = db.collection("Chat");
docs.get().then(function(doc) {
	doc.forEach((d) => 
  {
	if(d.id != strUserId)
	{
		var strLiTag = '<li id="lstUser" class="contact" onclick="chooseUser(this)" ><div class="wrap"><span class="contact-status online"></span><img src="'+ d.data().ProfileImg +'" alt="" /><div class="meta"><p id="spnCntName" class="name">'+ d.data().DisplayName +'</p><input type="hidden" id="hid" value="'+ d.id +'"><input type="hidden" id="hidToken" value="'+ d.data().fcmToken +'"></div></div></li>';
	  	document.getElementById("ulContacts").innerHTML=document.getElementById("ulContacts").innerHTML+strLiTag;
	}  
  });

}).catch(function(error) {
    console.log("Error getting document:", error);
});	
}
//----------------------------------
var hidEmail="";
var hidToToken="";
var roomId="";
//--Function to the choose the Users to chat with-----mariya
function chooseUser(objLi)
{
	var x = document.getElementsByClassName("contact");
	var i;
	for (i = 0; i < x.length; i++) {
 	 x[i].classList.remove("active");
	}
	//-- Add a class "Active" to LI -- which will highlight the User we have chosen --
	objLi.classList.add("active");
	document.getElementById("imgChtrProfile").src=objLi.childNodes[0].childNodes[1].src;
	document.getElementById("spnChtrName").innerHTML=objLi.childNodes[0].childNodes[2].childNodes[0].innerHTML;
	hidEmail=objLi.childNodes[0].childNodes[2].childNodes[1].value;
	hidToToken=objLi.childNodes[0].childNodes[2].childNodes[2].value;
	//----------------------------

	getUserMsgs();


	
	
}
//------------------------------
//--Function to the get the User messages-----mariya
function getUserMsgs()
{
	//---- sort strUserId and hidEmail ....
	var arrUsers = [];
	
	arrUsers.push(strUserId.toLowerCase());
	arrUsers.push(hidEmail.toLowerCase());
	arrUsers.sort();
	var docs = db.collection("rooms").where("user1", "==", arrUsers[0]).where("user2", "==", arrUsers[1]);	
	docs.get().then(function(doc) 
	{
		
    if (doc.empty == true)
    {
        db.collection("rooms").add({
			user1: arrUsers[0],
			user2: arrUsers[1],
				})
				.then(function(docRef) {
					roomId = docRef.id;
				})
				.catch(function(error) {
					console.error("Error adding document: ", error);
				});
    }
    else {
				doc.forEach((d) => 
				{ 
					
					roomId=d.id;
					// db.collection("rooms").orderBy("timeStamp", doc(roomId).collection("msgs").ASCENDING).get({});
					db.collection("rooms").doc(d.id).collection("msgs").orderBy("msg_on").get().then(function(msgs)
					{
						var strLi ="";
						document.getElementById("ulMsgs").innerHTML = "";
						msgs.forEach((m)=>
						{ 
						if(m.data().msg_from===strUserId)
							{
							strLi = '<li class="sent"><img src="' + document.getElementById("imgProfile").src + '" alt="" /><p>' + m.data().msg + '</p></li>';	
						}
						else
							{	
							strLi = '<li class="replies"><img src="' + document.getElementById("imgChtrProfile").src + '" alt="" /><p>' + m.data().msg + '</p></li>';
							}
						document.getElementById("ulMsgs").innerHTML = document.getElementById("ulMsgs").innerHTML + strLi;
						}
			
						)
						var objChatDiv = document.getElementById("divChatM");
						objChatDiv.scrollTop = objChatDiv.scrollHeight;	
					}).catch(function(error) {
						console.log("Error getting document:", error);
					});	
				})      
    	}
	});
	listener = db.collection("rooms").doc(roomId).collection("msgs").where("msg_from", "==", arrUsers[0]).where("msg_to", "==", arrUsers[1]);
}
//---------------
// listener.onSnapshot(function(liveData) 
// 	{ 
// 		console.log("Current data: ", liveData.id);
// 		getUserMsgs();
// });
//----------------------
