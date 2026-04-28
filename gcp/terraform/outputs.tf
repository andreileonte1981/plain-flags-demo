output "backend_url" {
  description = "Public URL of the demo backend service."
  value       = google_cloud_run_v2_service.demo_backend.uri
}

output "webapp_url" {
  description = "Public URL of the demo webapp service."
  value       = google_cloud_run_v2_service.demo_webapp.uri
}

output "plainflags_service_urls" {
  description = "Service URLs from the Plain Flags module."
  value       = module.plainflags.service_urls
}

output "plainflags_states_apikey_secret_id" {
  description = "Secret ID created by the Plain Flags module for states API key."
  value       = module.plainflags.deployment_names.secret_ids.states_apikey
}
