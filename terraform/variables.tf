variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "billing_account_id" {
  description = "The ID of the billing account to associate with the project"
  type        = string
  default     = ""
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
  default     = "europe-central2"  # Warsaw region
}

variable "zone" {
  description = "The zone to deploy resources to"
  type        = string
  default     = "europe-central2-a"
}

variable "environment" {
  description = "The environment (prod, dev, etc.)"
  type        = string
  default     = "prod"
}