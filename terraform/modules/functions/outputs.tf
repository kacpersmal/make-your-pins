output "function_url" {
  description = "The URL of the deployed function"
  value       = google_cloudfunctions2_function.function.service_config[0].uri
}

output "function_name" {
  description = "The name of the deployed function"
  value       = google_cloudfunctions2_function.function.name
}