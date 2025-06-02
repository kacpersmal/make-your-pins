variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
}

variable "database_name" {
  description = "The name of the Firestore database"
  type        = string
  default     = "make-your-pins-db"
}

variable "auth_providers" {
  description = "List of authentication providers to enable"
  type        = list(string)
  default     = ["google.com", "password", "anonymous"]
}