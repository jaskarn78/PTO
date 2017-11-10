/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes Chat.
var getConvoFromMe;
var getConvoToMe;
var messagesRef;
var recipient;
var details = [];
var userId;
var matches = [];
function Chat() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  //this.userMatchList = $("#matched_users");
  this.userLink    = $('.mdl-navigation__link');
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.submitButton = document.getElementById('submit');
  this.submitImageButton = document.getElementById('submitImage');
  this.imageForm = document.getElementById('image-form');
  this.mediaCapture = document.getElementById('mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');
  this.userInfo = JSON.parse(sessionStorage.getItem("userData"));

  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  this.messageInput.addEventListener('change', buttonTogglingHandler);
 
  // Events for image upload.
  this.submitImageButton.addEventListener('click', function(e) {
    e.preventDefault();
    this.mediaCapture.click();
  }.bind(this));
  this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
Chat.prototype.initFirebase = function() {
  // TODO(DEVELOPER): Initialize Firebase.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  this.firestore = firebase.firestore();
  firebase.auth().onAuthStateChanged(function(user) {
    Chat.onStart(user);
  });

};

// Loads chat messages history and listens for upcoming ones.
Chat.prototype.loadMessages = function(members) {
  // TODO(DEVELOPER): Load and listens for new messages.
  this.messageList.innerHTML = '';
  this.chatRef = this.database.ref().child("chats").push();
  var chatKey = this.chatRef.key;
  this.database.ref().child("members").orderByChild(recipient).equalTo(true)
  .once("value", function(snapshot){
    firebase.database().ref().child("members").orderByChild(Chat.userInfo.userData.uid).equalTo(true) 
    .once("value", function(userSnap2){
      console.log(extend({}, snapshot.val(), userSnap2.val()));
    
      var memberData = extend({}, snapshot.val(), userSnap2.val());
      //console.log(memberData);
      //Check if previous conversation between two users exists
      if(isEmpty(memberData)){
        var key = firebase.database().ref().child("members").push(members).key;
        messagesRef =  firebase.database().ref().child("/messages/"+key+"/");
        setMsg(messagesRef);
      }
      else{
        var key = Object.keys(snapshot.val())[0];
        messagesRef =  firebase.database().ref().child("/messages/"+key+"/");
        setMsg(messagesRef);
     }
   });
  });
};

function setMsg(messageRef){
  //load last 12 messages and listen for new ones
  var setMessage = function(data){
    var val = data.val();
    Chat.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  messagesRef.limitToLast(12).on('child_added', setMessage);
  messagesRef.limitToLast(12).on('child_changed', setMessage);
}


// Saves a new message on the Firebase DB.
Chat.prototype.saveMessage = function(e) {
  e.preventDefault();
  if(!getConvoFromMe){
    alert("Please select recipient first!");
    return;
  }

  // Check that the user entered a message and is signed in.
  if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var currentUser = this.userInfo.userData;

    //Add a new message entry to database
    messagesRef.push({
        name: this.user.displayName,
        text: this.messageInput.value,
        photoUrl: currentUser.photoURL || '/images/profile_placeholder.png',
        timestamp: Date.now(),
        toId: recipient,
        fromId: this.user.uid
    }).then(function(){
      resetMaterialTextfield(this.messageInput);
      sendMessagePush(currentUser.name, this.messageInput.value);
      this.toggleButton();
    }.bind(this)).catch(function(error){
      console.error("Error writing new messages to database", error);
    });
  }
  //Add a new message entry to database


};



// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
Chat.prototype.setImageUrl = function(imageUri, imgElement) {
  //If image is a cloud storage URI, we fetch the url
  if(imageUri.startsWith('gs://')){
    //Display loading image while file is fetched
    imgElement.src = getLoadingImageUrl;
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata){
      imgElement.src = metadata.downloadURLs[0];
    });
  }else{
    imgElement.src = imageUri;
  }
  // TODO(DEVELOPER): If image is on Cloud Storage, fetch image URL and set img element's src.
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
Chat.prototype.saveImageMessage = function(event) {
  event.preventDefault();
  var file = event.target.files[0];
  // A loading image URL.
  //Chat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';
  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (this.checkSignedInWithMessage()) {
    // TODO(DEVELOPER): Upload image to Firebase storage and add message.
    var currentUser = this.userInfo.userData;
    messagesRef.push({
      name: currentUser.name,
      toId: recipient,
      imageUrl: getLoadingImageUrl(),
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function(data){
      //Upload image to cloud storage
      var filePath = currentUser.uid+'/'+data.key+'/'+file.name;
      return this.storage.ref(filePath).put(file).then(function(snapshot){
        //Get the file's Storage URI and update the chat message placeholder.
        var fullPath = snapshot.metadata.fullPath;
        return data.update({imageUrl: this.storage.ref(fullPath).toString()});
      }.bind(this));
    }.bind(this)).catch(function(error){
      console.error('There was an error uploading a file to cloud storage:', error);
    });

  }
};

// Signs-in  Chat.
Chat.prototype.signIn = function() {
  // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of  Chat.
Chat.prototype.signOut = function() {
  // TODO(DEVELOPER): Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Chat.prototype.onStart = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;
    this.user = user;
    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

 // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
    // We load currently existing chant messages.
    this.loadMatches(user);

   
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

Chat.prototype.loadMatches = function(curUser){
  var db = this.firestore;
  var user = this.userInfo.userData;
  console.log(this.userInfo);
  db.collection("users").where("userData.gender", "==", user.seeking)
    .where("userData.seeking", "==", user.gender)
    .get().then(function(querySnapshot){
      var index = 0;
      querySnapshot.forEach(function(doc){
        var match = doc.data();
        matches.push('<li class="matched_userList"><a class="userChat waves-effect" data-toId="'+match.userData.uid+'">\
              <img src="'+match.userData.photoURL+'"class="mdl-color-text--blue-grey-400 material-icons"\
              style="width:40px; height:40px;margin-bottom:10px;margin-right:5px; border-radius:50%;">'+match.userData.name+'</a></li>\
                  <li><div class="divider"></div></li>');
        /*$("#slide-out").append('<li class="matched_userList"><a class="userChat waves-effect" data-toId="'match.userData.uid'">'+
              '<img src="'+match.userData.photoURL+'"class="mdl-color-text--blue-grey-400 material-icons"'+
              'style="width:40px; height:40px;margin-bottom:10px;margin-right:5px; border-radius:50%;">'+match.userData.name+'</a></li>\
                  <li><div class="divider"></div></li>');*/
      });
      setUpUsers(matches);

    });

  };

  function setUpUsers(matches){
    matches.forEach(function(element){
      $("#slide-out").append(element);
    });
    var uid = Chat.userInfo.userData.uid;
     $("#slide-out li a").on("click", function(){
        var toId = $(this).attr("data-toId");
          console.log(uid);
        console.log(toId);
        $(".matched_userList").removeClass('active');
        $(this).parent().addClass('active');//.removeClass('active');
        getConvoFromMe = true;
        recipient = toId;
        var members = {[uid]:true, [toId]:true, to:toId, from:uid};
        Chat.loadMessages(members);

    });

   
  }



// Returns true if user is signed-in. Otherwise false and displays a message.
Chat.prototype.checkSignedInWithMessage = function() {
  /* TODO(DEVELOPER): Check if user is signed-in Firebase. */
  if(this.userInfo){
    return true;
  }
  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Saves the messaging device token to the datastore.
Chat.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      //console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(Chat.userInfo.userData.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
};

// Requests permissions to show notifications.
Chat.prototype.requestNotificationsPermissions = function() {
  //console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
};

// Resets the given MaterialTextField.
function resetMaterialTextfield(element){
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
function getMessageTemplate(){
  var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic" ></div></div>' +
      '<div class="message" style="font-size:20px;"></div>' +
      '<div class="name"></div>' +
    '</div>';
    return MESSAGE_TEMPLATE;
}

function getLoadingImageUrl(){
  return 'https://www.google.com/images/spin-32.gif';
}



function sendMessagePush(name, text){
  firebase.messaging().getToken().then(function(currentToken){
    if(currentToken){
      $.ajax({        
        type : 'POST',
        url : "https://fcm.googleapis.com/fcm/send",
        headers : {
            Authorization : 'key=' + 'AAAAF5pJnKc:APA91bFCzHjLvnbCvGP3C-GO6SfWWqaiEHOw-EZqwD8PHltA6WJsGsiTtfhsb4BM8GOD6aHmbkxqvT136qLhSkhJVeWVnGbr0diBG2EnDi-IhMJB4kuUJlFbtia7oWUgWs8_xyy44ucm'
        },
        contentType : 'application/json',
        dataType: 'json',
        data: JSON.stringify({"to": currentToken, "notification": {"title":name,"body":text, "icon":"pt-heart.png","click_action": "http://localhost:8081"}}),
        success : function(response) {
            //console.log(currentToken);
        },
        error : function(xhr, status, error) {
            console.log(xhr.error);                   
        }
      });
    }
  });
}



// Displays a Message in the UI.
Chat.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  //console.log(key, name, text, picUrl);
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = getMessageTemplate();
    div = container.firstChild;
    div.setAttribute('id', key);
    Chat.messageList.appendChild(div);
    //console.log(this.messageList);
  }
  if (picUrl) {
        div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    this.setImageUrl(imageUri, image);
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
Chat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

function extend(base) {
    var parts = Array.prototype.slice.call(arguments, 1);
    parts.forEach(function (p) {
        if (p && typeof (p) === 'object') {
            for (var k in p) {
                if (p.hasOwnProperty(k)) {
                    base[k] = p[k];
                }
            }
        }
    });
    return base;
}

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

// Checks that the Firebase SDK has been correctly setup and configured.
Chat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  // Initialize collapse button
  window.Chat = new Chat();
};
