variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
}

variable "service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "pins-api"
}

variable "container_image" {
  description = "The container image to deploy"
  type        = string
  default     = "europe-central2-docker.pkg.dev/PROJECT_ID/make-your-pins/pins-api:latest"
}

variable "service_account_email" {
  description = "The service account email to use for the Cloud Run service"
  type        = string
  default     = ""
}

variable "memory_limit" {
  description = "Memory limit for the Cloud Run service"
  type        = string
  default     = "512Mi"
}

variable "cpu_limit" {
  description = "CPU limit for the Cloud Run service"
  type        = string
  default     = "1"
}

variable "max_instances" {
  description = "Maximum number of instances"
  type        = number
  default     = 2
}

variable "min_instances" {
  description = "Minimum number of instances"
  type        = number
  default     = 0
}

variable "container_port" {
  description = "Port on which the container is listening"
  type        = number
  default     = 8080
}

variable "container_concurrency" {
  description = "Maximum number of concurrent requests per container"
  type        = number
  default     = 80
}

variable "timeout_seconds" {
  description = "Maximum time a request can take before timing out"
  type        = number
  default     = 300
}

variable "env_vars" {
  description = "Environment variables for the Cloud Run service"
  type        = map(string)
  default     = {
    NODE_ENV = "production"
  }
}