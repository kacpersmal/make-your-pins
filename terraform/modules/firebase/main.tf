# Initialize Firebase in the project
resource "google_app_engine_application" "firebase_init" {
  project     = var.project_id
  location_id = var.region
  database_type = "CLOUD_FIRESTORE"
}

# Create Firestore database
resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = var.database_name
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  # Add depends_on to ensure Firebase is initialized first
  depends_on = [google_app_engine_application.firebase_init]
}

# Set up default Firestore security rules
resource "google_firestore_document" "firestore_rules" {
  project     = var.project_id
  collection  = "_firestore_rules"
  document_id = "firebase-rules"
  fields      = jsonencode({
    rules = {
      stringValue = <<-EOT
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          // Authenticated users can read and write their own data
          match /users/{userId} {
            allow read, update, delete: if request.auth != null && request.auth.uid == userId;
            allow create: if request.auth != null;
          }

          // Public pins collection - anyone can read, only authenticated users can create
          match /pins/{pinId} {
            allow read: if true;
            allow create: if request.auth != null;
            allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
          }

          // Default deny
          match /{document=**} {
            allow read, write: if false;
          }
        }
      }
      EOT
    }
  })

  depends_on = [google_firestore_database.database]
}

# Note: Firebase Authentication providers cannot be fully configured through Terraform
# You'll need to use the Firebase Console or Firebase Admin SDK to completely set up authentication
# This resource serves as documentation for the auth providers that should be enabled
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  depends_on = [google_app_engine_application.firebase_init]
}

# Output a local file with instructions for completing Firebase setup
resource "local_file" "firebase_setup_instructions" {
  filename = "${path.module}/firebase_setup_instructions.md"
  content = <<-EOT
  # Firebase Setup Instructions

  Terraform has created the basic Firebase infrastructure, but you need to complete the setup in the Firebase Console:

  1. Go to [Firebase Console](https://console.firebase.google.com/)
  2. Select your project: ${var.project_id}
  3. Navigate to Authentication section and enable these providers:
     ${join("\n     - ", var.auth_providers)}
  4. For Google Sign-In, configure OAuth consent screen in Google Cloud Console
  5. For Email/Password, set up email templates if needed
  6. Get your Firebase Web config from Project Settings > General > Your Apps > Web

  This config will need to be added to your web application.
  EOT
}