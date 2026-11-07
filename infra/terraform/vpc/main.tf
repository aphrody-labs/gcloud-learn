terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

variable "project_id" {
  type    = string
  default = "aphrody"
}

variable "region" {
  type    = string
  default = "europe-west9"
}

resource "google_compute_network" "custom_vpc" {
  name                    = "gcloud-learn-paris-vpc"
  auto_create_subnetworks = false
  routing_mode            = "GLOBAL"
}

resource "google_compute_subnetwork" "subnet_paris" {
  name          = "subnet-paris-europe-west9"
  ip_cidr_range = "10.10.0.0/20"
  region        = var.region
  network       = google_compute_network.custom_vpc.id

  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "pods-paris"
    ip_cidr_range = "10.20.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services-paris"
    ip_cidr_range = "10.30.0.0/20"
  }
}

resource "google_compute_router" "nat_router" {
  name    = "router-paris"
  network = google_compute_network.custom_vpc.name
  region  = var.region
}

resource "google_compute_router_nat" "nat_gw" {
  name                               = "nat-gateway-paris"
  router                             = google_compute_router.nat_router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}
