output "service_url" {
  description = "The URL of the deployed Cloud Run service"
  value       = google_cloud_run_v2_service.service.uri
}

output "service_name" {
  description = "The name of the deployed Cloud Run service"
  value       = google_cloud_run_v2_service.service.name
}

output "service_account_email" {
  description = "The email of the service account used by the Cloud Run service"
  value       = google_service_account.cloudrun_service_account.email
}

output "artifact_repository" {
  description = "The Artifact Registry repository name"
  value       = google_artifact_registry_repository.repository.name
}