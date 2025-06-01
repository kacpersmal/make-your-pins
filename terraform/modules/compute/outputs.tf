output "client_app_ip" {
  description = "The external IP of the client app instance"
  value       = google_compute_instance.client_app.network_interface.0.access_config.0.nat_ip
}