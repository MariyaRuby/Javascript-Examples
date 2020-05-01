// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.14.0/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
var config = {
  apiKey: "AIzaSyCTCpgRwfPSvKsA2J130ilpuWLkS57Vckc",
  authDomain: "one-on-one-9f870.firebaseapp.com",
  databaseURL: "https://one-on-one-9f870.firebaseio.com",
  projectId: "one-on-one-9f870",
  storageBucket: "one-on-one-9f870.appspot.com",
  messagingSenderId: "49245167143",
  appId: "1:49245167143:web:6f2c9e7e5a9db3e4527802",
  measurementId: "G-1XQLMKPDNP"
};
firebase.initializeApp(config);

// Retrieve an instance of Firebase Data Messaging so that it can handle background messages.
const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: 'alarm.png'
  };
  
  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});