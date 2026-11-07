variable "dns_zone_name" {
  type    = string
  default = "aphrody-com-zone"
}

variable "dns_domain" {
  type    = string
  default = "aphrody.com."
}

resource "google_dns_managed_zone" "primary_zone" {
  name        = var.dns_zone_name
  dns_name    = var.dns_domain
  description = "Managed DNS Zone for Google Cloud Learn and Aphrody Ecosystem"
  visibility  = "public"

  dnssec_config {
    state = "on"
  }
}

resource "google_dns_record_set" "learn_cname" {
  name         = "gcloud-learn.${google_dns_managed_zone.primary_zone.dns_name}"
  managed_zone = google_dns_managed_zone.primary_zone.name
  type         = "CNAME"
  ttl          = 300
  rrdatas      = ["ghs.googlehosted.com."]
}
