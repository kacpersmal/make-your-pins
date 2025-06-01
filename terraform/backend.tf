terraform {
  required_version = ">= 1.0.0"

  backend "gcs" {
    bucket = "make-your-pins-tf-state"
    prefix = "terraform/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}