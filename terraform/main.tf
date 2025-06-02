provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Enable required APIs
resource "google_project_service" "services" {
  for_each = toset([
    "compute.googleapis.com",      # Compute Engine
    "storage.googleapis.com",      # Cloud Storage
    "cloudfunctions.googleapis.com", # Cloud Functions
    "firebase.googleapis.com",     # Firebase
    "firestore.googleapis.com",    # Firestore
    "run.googleapis.com",          # Cloud Run
    "artifactregistry.googleapis.com", # Artifact Registry
  ])

  project = var.project_id
  service = each.key

  disable_on_destroy = false
}

# Network configuration
module "network" {
  source     = "./modules/network"
  project_id = var.project_id
  region     = var.region
}

# Storage resources
module "storage" {
  source     = "./modules/storage"
  project_id = var.project_id
  region     = var.region
  bucket_names = {
    static_assets = "${var.project_id}-assets"
  }

  depends_on = [google_project_service.services]
}

# Compute Engine for client app
module "compute" {
  source     = "./modules/compute"
  project_id = var.project_id
  region     = var.region
  zone       = var.zone
  network_id = module.network.network_id
  subnet_id  = module.network.subnet_id

  depends_on = [
    google_project_service.services,
    module.network
  ]
}

# IAM permissions
module "iam" {
  source     = "./modules/iam"
  project_id = var.project_id

  depends_on = [google_project_service.services]
}

# Cloud Functions
module "functions" {
  source     = "./modules/functions"
  project_id = var.project_id
  region     = var.region
  static_assets_bucket = module.storage.static_assets_bucket

  depends_on = [
    google_project_service.services,
    module.storage
  ]
}

module "cloudrun" {
  source     = "./modules/cloudrun"
  project_id = var.project_id
  region     = var.region

  # The container image will be updated by the CI/CD pipeline
  container_image = "europe-central2-docker.pkg.dev/${var.project_id}/make-your-pins/pins-api:latest"

  depends_on = [
    google_project_service.services
  ]
}