output "client_app_ip" {
  description = "The IP address of the client app"
  value       = module.compute.client_app_ip
}

output "static_assets_bucket" {
  description = "The name of the static assets bucket"
  value       = module.storage.static_assets_bucket
}

output "cloud_function_name" {
  description = "The name of the deployed Cloud Function"
  value       = module.functions.function_name
}

output "cloud_function_url" {
  description = "The URL of the deployed Cloud Function"
  value       = module.functions.function_url
}

output "pins_api_url" {
  description = "The URL of the Pins API service"
  value       = module.cloudrun.service_url
}

output "firestore_database_id" {
  description = "The ID of the Firestore database"
  value       = module.firebase.firestore_database_id
}

output "firebase_setup_instructions" {
  description = "Instructions for completing Firebase setup"
  value       = "See firebase_setup_instructions.md in the modules/firebase directory"
}