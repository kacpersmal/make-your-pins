output "firestore_database_id" {
  description = "The ID of the Firestore database"
  value       = google_firestore_database.database.id
}

output "web_app_config" {
  description = "Firebase configuration for web clients"
  value       = {
    project_id        = var.project_id
    storage_bucket    = "${var.project_id}.appspot.com"
    api_key           = "Use Firebase Console to obtain"
    auth_domain       = "${var.project_id}.firebaseapp.com"
    database_url      = "https://${var.project_id}.firebaseio.com"
    messaging_sender_id = "Use Firebase Console to obtain"
    app_id            = "Use Firebase Console to obtain"
  }
  sensitive = true
}