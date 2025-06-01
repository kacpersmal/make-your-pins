# Service account for the client app
resource "google_service_account" "client_app" {
  account_id   = "client-app-sa"
  display_name = "Client App Service Account"
  project      = var.project_id
}

# Grant the service account access to Cloud Storage
resource "google_project_iam_member" "storage_object_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.client_app.email}"
}

# Additional IAM permissions can be added as needed