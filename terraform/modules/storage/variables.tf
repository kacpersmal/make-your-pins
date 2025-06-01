variable "project_id" {
  description = "The ID of the Google Cloud project"
  type        = string
}

variable "region" {
  description = "The region to deploy resources to"
  type        = string
}

variable "bucket_names" {
  description = "Names for the various buckets"
  type        = object({
    static_assets = string
  })
}