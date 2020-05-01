// Request for permission - mariya
messaging.requestPermission()
.then(function() {
  console.log('Notification permission granted.');
  // TODO(developer): Retrieve an Instance ID token for use with FCM. - mariya
  messaging.getToken()
  .then(function(currentToken) {
    if (currentToken) {
      console.log('Token: ' + currentToken);
      gcmToken = currentToken;
    //   sendTokenToServer(currentToken);
    } else {
      console.log('No Instance ID token available. Request permission to generate one.');
    //   setTokenSentToServer(false);
    }
  })
  .catch(function(err) {
    console.log('An error occurred while retrieving token. ', err);
    // setTokenSentToServer(false);
  });
})
.catch(function(err) {
  console.log('Unable to get permission to notify.', err);
});
// Handle incoming messages - mariya
messaging.onMessage(function(payload) {
  console.log("Rakesh Notification received: ", payload.data);
//   toastr["info"](payload.data.body, payload.data.title);
  getUserMsgs();
});


// Callback fired if Instance ID token is updated. - mariya
messaging.onTokenRefresh(function() {
  messaging.getToken()
  .then(function(refreshedToken) {
    console.log('Token refreshed.');
    // Indicate that the new Instance ID token has not yet been sent to the app server. - mariya
    setTokenSentToServer(false);
    // Send Instance ID token to app server. - mariya
    sendTokenToServer(refreshedToken);
  })
  .catch(function(err) {
    console.log('Unable to retrieve refreshed token ', err);
  });
});

//------------------
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().onAuthStateChanged(function(user) {
if (user) {
var user = firebase.auth().currentUser;
if(user != null)
{
   objUser=user;
  document.getElementById("containerLogin").style.display="none";
   document.getElementById("containerOneOnOne").style.display="block";
   console.log("Is FCM generated -- " + gcmToken);
   db.collection("Chat").doc(objUser.email).update({
       IsOnline:true,
       fcmToken:gcmToken
});
console.log(objUser.email);
  getList();
}
} else 
{
document.getElementById("containerLogin").style.display="block";
 document.getElementById("containerOneOnOne").style.display="none";
}
});
//---------------------------
//--Function to access the Gmail-----mariya
function goToGmail()
{
  firebase.auth().signInWithRedirect(provider);
}

function FromGmail()
{
    console.log(objUser.email);
  firebase.auth().getRedirectResult().then(function(result) 
    {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      
      console.log("TOKEN   :  " + token);
    }
    // The signed-in user info.
     objUser = result.user;
    console.log("EMAIL  :  " + objUser.email);
    db.collection("Chat").doc(objUser.email).set({
        DisplayName: objUser.displayName,
        IsOnline: false,
        ProfileImg: objUser.photoURL
        }).then(function(objUsers){
            alert(objUsers.id);
        });
   document.getElementById("containerLogin").style.display="none";
   document.getElementById("containerOneOnOne").style.display="block";
  //  getList();

  }).catch(function(error) {
    // Handle Errors here - mariya
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used. - mariya
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used. - mariya
    var credential = error.credential;
    // ...
  });
  
}
//--------------
	// Function to SignOut from G-mail -- mariya
    function signOut()
    {
              firebase.auth().signOut().then(function() {
          // Sign-out successful.
          console.log("Logout Success");
          document.getElementById("containerLogin").style.display="block";
         document.getElementById("containerOneOnOne").style.display="none";  
        }).catch(function(error) {
          // An error happened.
        });
    }