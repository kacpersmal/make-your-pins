output "client_app_ip" {
  description = "The IP address of the client app"
  value       = module.compute.client_app_ip
}

output "static_assets_bucket" {
  description = "The name of the static assets bucket"
  value       = module.storage.static_assets_bucket
}