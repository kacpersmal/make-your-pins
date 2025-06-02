# Firebase Setup Instructions

Terraform has created the basic Firebase infrastructure, but you need to complete the setup in the Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: make-your-pin
3. Navigate to Authentication section and enable these providers:
   google.com
     - password
4. For Google Sign-In, configure OAuth consent screen in Google Cloud Console
5. For Email/Password, set up email templates if needed
6. Get your Firebase Web config from Project Settings > General > Your Apps > Web

This config will need to be added to your web application.
