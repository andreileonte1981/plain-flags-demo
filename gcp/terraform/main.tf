locals {
  project_id = "plain-flags-demo"
  region     = "europe-central2"

  backend_image = "ghcr.io/andreileonte1981/plain-flags-demo-service-gcp:latest"
  webapp_image  = "ghcr.io/andreileonte1981/plain-flags-demo-webapp-gcp:latest"

  backend_service_name = "plain-flags-demo-backend-${var.service_name_suffix}"
  webapp_service_name  = "plain-flags-demo-webapp-${var.service_name_suffix}"
}

module "plainflags" {
  source = "git::https://github.com/andreileonte1981/plain-flags.git//gcp/infrastructure/terraform?ref=main"

  project_id               = local.project_id
  region                   = local.region
  deployment_name_suffix   = var.plainflags_deployment_name_suffix
  superadmin_email         = var.superadmin_email
  firebase_auth_domain     = var.firebase_auth_domain
  firebase_api_key         = var.firebase_api_key
  firebase_app_id          = var.firebase_app_id
  firebase_project_id      = local.project_id
  management_image_version = "latest"
  states_image_version     = "latest"
  dashboard_image_version  = "latest"
}

resource "google_service_account" "app_runner" {
  account_id   = "plain-flags-demo-runner"
  display_name = "Plain Flags Demo App Runner"
}

resource "google_secret_manager_secret_iam_member" "backend_apikey_access" {
  project   = local.project_id
  secret_id = module.plainflags.deployment_names.secret_ids.states_apikey
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app_runner.email}"
}

resource "google_cloud_run_v2_service" "demo_backend" {
  name     = local.backend_service_name
  location = local.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.app_runner.email

    containers {
      image = local.backend_image

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "PLAIN_FLAGS_STATES_URL"
        value = module.plainflags.service_urls.states
      }

      env {
        name = "PLAIN_FLAGS_API_KEY"
        value_source {
          secret_key_ref {
            secret  = module.plainflags.deployment_names.secret_ids.states_apikey
            version = "latest"
          }
        }
      }

      ports {
        container_port = 8080
      }
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [
    module.plainflags,
    google_secret_manager_secret_iam_member.backend_apikey_access
  ]
}

resource "google_cloud_run_v2_service_iam_member" "demo_backend_public" {
  project  = local.project_id
  location = local.region
  name     = google_cloud_run_v2_service.demo_backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service" "demo_webapp" {
  name     = local.webapp_service_name
  location = local.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = local.webapp_image

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "GRID_URL"
        value = "${google_cloud_run_v2_service.demo_backend.uri}/api/grid"
      }

      ports {
        container_port = 8080
      }
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [
    google_cloud_run_v2_service.demo_backend
  ]
}

resource "google_cloud_run_v2_service_iam_member" "demo_webapp_public" {
  project  = local.project_id
  location = local.region
  name     = google_cloud_run_v2_service.demo_webapp.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
