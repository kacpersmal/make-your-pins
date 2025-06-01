# Bucket for static assets (client app build output)
resource "google_storage_bucket" "static_assets" {
  name     = var.bucket_names.static_assets
  project  = var.project_id
  location = var.region

  # Ensure uniform bucket-level access
  uniform_bucket_level_access = true

  # Public access prevention
  public_access_prevention = "enforced"

  # Versioning configuration
  versioning {
    enabled = true
  }

  # Lifecycle rules
  lifecycle_rule {
    condition {
      age = 365  # days - keep images for 1 year
    }
    action {
      type = "Delete"
    }
  }
}