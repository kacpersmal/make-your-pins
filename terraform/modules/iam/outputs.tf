output "client_app_service_account" {
  description = "The email of the client app service account"
  value       = google_service_account.client_app.email
}