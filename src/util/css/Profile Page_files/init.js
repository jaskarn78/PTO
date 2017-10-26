if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
firebase.initializeApp({
  "apiKey": "AIzaSyDXjq1Or10iD_J229t3qxyWxskmDBxjJ3s",
  "databaseURL": "https://ptoapp-90ad1.firebaseio.com",
  "storageBucket": "ptoapp-90ad1.appspot.com",
  "authDomain": "ptoapp-90ad1.firebaseapp.com",
  "messagingSenderId": "101372763303",
  "projectId": "ptoapp-90ad1"
});
