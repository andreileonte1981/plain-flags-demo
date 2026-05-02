terraform {
  required_version = ">= 1.6.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.31"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.31"
    }
  }
}

provider "google" {
  project = "plain-flags-demo"
  region  = "europe-central2"
}

provider "google-beta" {
  project = "plain-flags-demo"
  region  = "europe-central2"
}
