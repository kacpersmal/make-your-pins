# Create Artifact Registry Repository
resource "google_artifact_registry_repository" "repository" {
  location      = var.region
  repository_id = "make-your-pins"
  description   = "Docker repository for Make Your Pins services"
  format        = "DOCKER"
  project       = var.project_id
}

# Service account for the Cloud Run service
resource "google_service_account" "cloudrun_service_account" {
  account_id   = "pins-api-sa"
  display_name = "Pins API Service Account"
  project      = var.project_id
}

# Give the service account access to Cloud Storage
resource "google_project_iam_member" "cloudrun_storage_object_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.cloudrun_service_account.email}"
}

# Give the service account access to Firestore
resource "google_project_iam_member" "cloudrun_firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.cloudrun_service_account.email}"
}

# Cloud Run service
resource "google_cloud_run_v2_service" "service" {
  name     = var.service_name
  location = var.region
  project  = var.project_id

  template {
    containers {
      image = var.container_image

      resources {
        limits = {
          cpu    = var.cpu_limit
          memory = var.memory_limit
        }
      }

      ports {
        container_port = var.container_port
      }

      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    timeout = "${var.timeout_seconds}s"

    service_account = google_service_account.cloudrun_service_account.email
  }

  depends_on = [
    google_artifact_registry_repository.repository
  ]
}

# IAM policy to make the service publicly accessible
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.service.location
  service  = google_cloud_run_v2_service.service.name
  role     = "roles/run.invoker"
  member   = "allUsers"
  project  = var.project_id
}