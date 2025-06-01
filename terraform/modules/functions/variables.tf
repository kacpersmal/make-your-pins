variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
}

variable "static_assets_bucket" {
  description = "The name of the static assets bucket"
  type        = string
}

variable "function_name" {
  description = "The name of the Cloud Function"
  type        = string
  default     = "process-uploaded-file"
}

variable "function_runtime" {
  description = "The runtime for the Cloud Function"
  type        = string
  default     = "nodejs20"
}

variable "function_entry_point" {
  description = "The entry point for the Cloud Function"
  type        = string
  default     = "processUploadedFile"
}