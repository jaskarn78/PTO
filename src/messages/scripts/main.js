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
  console.log(this.userLink);
  this.onStart();
};

// Loads chat messages history and listens for upcoming ones.
Chat.prototype.loadMessages = function() {
  // TODO(DEVELOPER): Load and listens for new messages.
  this.messageList.innerHTML = '';
  this.messagesRefToMe = this.database.ref('conversations/'+getConvoToMe+'/messages/');
  this.messagesRefFromMe = this.database.ref('conversations/'+getConvoFromMe+'/messages/');
  this.messagesRefToMe.off();
  this.messagesRefFromMe.off();
  console.log(getConvoToMe);
  console.log(getConvoFromMe);

  //load last 12 messages and listen for new ones
  var setMessage = function(data){
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl);
  }.bind(this);
  this.messagesRefToMe.limitToLast(12).on('child_added', setMessage);
  this.messagesRefToMe.limitToLast(12).on('child_changed', setMessage);
  this.messagesRefFromMe.limitToLast(12).on('child_added', setMessage);
  this.messagesRefFromMe.limitToLast(12).on('child_changed', setMessage);
};

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
    this.messagesRefFromMe.push({
      name: currentUser.name,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(function(){
      resetMaterialTextfield(this.messageInput);
      this.toggleButton();
    }.bind(this)).catch(function(error){
      console.error("Error writing new messages to database", error);
    });
  }
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
    this.messagesRefFromMe.push({
      name: currentUser.name,
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
Chat.prototype.onStart = function() {
  if (this.userInfo) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = this.userInfo.userData.photoURL;
    var userName = this.userInfo.userData.name;

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    // We load currently existing chant messages.
    this.loadMatches();

    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

Chat.prototype.loadMatches = function(){
  var db = this.firestore;
  var user = this.userInfo.userData;
  db.collection("users").where("userData.gender", "==", parseInt(user.seeking))
    .where("userData.seeking", "==", parseInt(user.gender))
    .get().then(function(querySnapshot){
      var index = 0;
      querySnapshot.forEach(function(doc){
        var match = doc.data();
        $("#matched_users").append('<a class="mdl-navigation__link" id="'+match.userData.uid+'"">'+
              '<img src="'+match.userData.photoURL+'"class="mdl-color-text--blue-grey-400 material-icons"'+
              'style="width:40px; height:40px; border-radius:50%;">'+match.userData.name+'</a>');
    });
    $(".mdl-navigation__link").on("click", function(){
        var toId = $(this).attr("id").replace("-", "");
        getConvoFromMe = user.uid+"_"+toId;
        getConvoToMe = toId+"_"+user.uid;
        Chat.loadMessages();

    });
  });
};



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
  // TODO(DEVELOPER): Save the device token in the realtime datastore
};

// Requests permissions to show notifications.
Chat.prototype.requestNotificationsPermissions = function() {
  // TODO(DEVELOPER): Request permissions to send notifications.
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
    console.log(this.messageList);
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

// Checks that the Firebase SDK has been correctly setup and configured.
Chat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  window.Chat = new Chat();
};
