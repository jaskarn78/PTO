document.addEventListener('DOMContentLoaded', function() {
  // TODO: Implement getParameterByName()

  // Get the action to complete.
  var mode = getParameterByName('mode');
  // Get the one-time code from the query parameter.
  var actionCode = getParameterByName('oobCode');
  // (Optional) Get the API key from the query parameter.
  var apiKey = getParameterByName('apiKey');
  // (Optional) Get the continue URL from the query parameter if available.
  var continueUrl = 'jagpal-development.com/php/setup/AddImage';

  // Configure the Firebase SDK.
  // This is the minimum configuration required for the API to be used.
  var config = {
    apiKey: "AIzaSyD657gqCD1kkqRTmrqy0mIbw9gpfiOKyQg",

  };
  var app = firebase.initializeApp(config);
  var auth = app.auth();

  // Handle the user management action.
  switch (mode) {
    case 'resetPassword':
      // Display reset password handler and UI.
      handleResetPassword(auth, actionCode, continueUrl);
      break;
    case 'recoverEmail':
      // Display email recovery handler and UI.
      handleRecoverEmail(auth, actionCode);
      break;
    case 'verifyEmail':
      // Display email verification handler and UI.
      handleVerifyEmail(auth, actionCode, continueUrl);
      break;
    default:
      // Error: invalid mode.
  }
}, false);

function handleVerifyEmail(auth, actionCode, continueUrl) {
  // Try to apply the email verification code.
  auth.applyActionCode(actionCode).then(function(resp) {
    // Email address has been verified.

    // TODO: Display a confirmation message to the user.
    // You could also provide the user with a link back to the app.
    alert('email has been verified');
    // TODO: If a continue URL is available, display a button which on
    // click redirects the user back to the app via continueUrl with
    // additional state determined from that URL's parameters.
  }).catch(function(error) {
    // Code is invalid or expired. Ask the user to verify their email address
    // again.
  });
}