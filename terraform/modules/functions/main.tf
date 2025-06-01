data "google_project" "project" {
  project_id = var.project_id
}

# Grant the Cloud Storage service account permission to publish to Pub/Sub
resource "google_project_iam_member" "gcs_pubsub_publishing" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:service-${data.google_project.project.number}@gs-project-accounts.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "function_sa_storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"  # Changed from objectViewer to objectAdmin
  member  = "serviceAccount:${google_service_account.function_sa.email}"
}

# Service account for the Cloud Function
resource "google_service_account" "function_sa" {
  account_id   = "cf-file-processor-sa"
  display_name = "Cloud Function File Processor Service Account"
  project      = var.project_id
}

# Create a Cloud Storage bucket for the function source code
resource "google_storage_bucket" "function_source" {
  name     = "${var.project_id}-function-source"
  location = var.region
  uniform_bucket_level_access = true
}

# Archive the function source code
data "archive_file" "function_source" {
  type        = "zip"
  output_path = "${path.module}/function-source.zip"

  source {
    content  = <<EOF
const functions = require('@google-cloud/functions-framework');

// Register a CloudEvent function for handling storage events
functions.cloudEvent('${var.function_entry_point}', cloudEvent => {
  // The CloudEvent object contains information about the event
  console.log('Event ID:', cloudEvent.id);
  console.log('Event Type:', cloudEvent.type);

  // The data contains information about the storage object
  const file = cloudEvent.data;
  console.log('Bucket:', file.bucket);
  console.log('File:', file.name);
  console.log('Metadata:', file.metadata);

  // Here you would add your file processing logic
  console.log('Processing file:', file.name);

  // Example: you could analyze images, generate thumbnails, extract text, etc.
  return Promise.resolve();
});
EOF
    filename = "index.js"
  }

  source {
    content  = <<EOF
{
  "name": "file-processor-function",
  "version": "1.0.0",
  "description": "Cloud Function to process uploaded files",
  "main": "index.js",
  "dependencies": {
    "@google-cloud/functions-framework": "^3.1.0"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
EOF
    filename = "package.json"
  }
}

# Upload the function source code to the bucket
resource "google_storage_bucket_object" "function_source" {
  name   = "function-source-${data.archive_file.function_source.output_md5}.zip"
  bucket = google_storage_bucket.function_source.name
  source = data.archive_file.function_source.output_path
}

# Create the Cloud Function
resource "google_cloudfunctions2_function" "function" {
  name        = var.function_name
  location    = var.region
  description = "Function to process files uploaded to the static assets bucket"
  project     = var.project_id

  build_config {
    runtime     = var.function_runtime
    entry_point = var.function_entry_point
    source {
      storage_source {
        bucket = google_storage_bucket.function_source.name
        object = google_storage_bucket_object.function_source.name
      }
    }
  }

  service_config {
    max_instance_count = 1
    available_memory   = "256M"
    timeout_seconds    = 60
    service_account_email = google_service_account.function_sa.email
  }

  event_trigger {
    trigger_region = var.region
    event_type     = "google.cloud.storage.object.v1.finalized"
    event_filters {
      attribute = "bucket"
      value     = var.static_assets_bucket
    }
  }

  depends_on = [
    google_project_iam_member.gcs_pubsub_publishing
  ]
}