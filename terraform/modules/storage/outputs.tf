output "static_assets_bucket" {
  description = "The name of the static assets bucket"
  value       = google_storage_bucket.static_assets.name
}
