locals {
  project_id = "plain-flags-demo"
  region     = "europe-central2"
  ghcr_user  = "andreileonte1981"

  ar_registry_base = "${local.region}-docker.pkg.dev/${local.project_id}/ghcr-proxy"
  backend_image    = "${local.ar_registry_base}/${local.ghcr_user}/plain-flags-demo-service-gcp:latest"
  webapp_image     = "${local.ar_registry_base}/${local.ghcr_user}/plain-flags-demo-webapp-gcp:latest"

  backend_service_name = "plain-flags-demo-backend-${var.service_name_suffix}"
  webapp_service_name  = "plain-flags-demo-webapp-${var.service_name_suffix}"
}

data "google_project" "project" {}

# ---------------------------------------------------------------------------
# GHCR credentials – stored in Secret Manager
# ---------------------------------------------------------------------------

resource "google_secret_manager_secret" "ghcr_pat" {
  secret_id = "ghcr-pat"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "ghcr_pat" {
  secret      = google_secret_manager_secret.ghcr_pat.id
  secret_data = trimspace(file("../../.secrets/ghcr-pat.txt"))
}

# Pre-provision the Artifact Registry service agent so we can grant it
# secret access before the remote repository is created (GCP validates
# credentials at repo creation time).
resource "google_project_service_identity" "ar_sa" {
  provider = google-beta
  project  = local.project_id
  service  = "artifactregistry.googleapis.com"
}

# Grant the Artifact Registry Service Agent access to the GHCR PAT secret
resource "google_secret_manager_secret_iam_member" "ar_ghcr_secret_access" {
  project   = local.project_id
  secret_id = google_secret_manager_secret.ghcr_pat.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_project_service_identity.ar_sa.email}"
}

# ---------------------------------------------------------------------------
# Artifact Registry remote repository – proxies ghcr.io
# ---------------------------------------------------------------------------

resource "google_artifact_registry_repository" "ghcr_proxy" {
  location      = local.region
  repository_id = "ghcr-proxy"
  format        = "DOCKER"
  mode          = "REMOTE_REPOSITORY"

  remote_repository_config {
    docker_repository {
      custom_repository {
        uri = "https://ghcr.io"
      }
    }
    upstream_credentials {
      username_password_credentials {
        username                = local.ghcr_user
        password_secret_version = google_secret_manager_secret_version.ghcr_pat.name
      }
    }
  }

  depends_on = [google_secret_manager_secret_iam_member.ar_ghcr_secret_access]
}

# Grant the Cloud Run service account read access to the AR repository
resource "google_artifact_registry_repository_iam_member" "app_runner_ar_reader" {
  project    = local.project_id
  location   = local.region
  repository = google_artifact_registry_repository.ghcr_proxy.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.app_runner.email}"
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

  depends_on = [module.plainflags]
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
    google_secret_manager_secret_iam_member.backend_apikey_access,
    google_artifact_registry_repository_iam_member.app_runner_ar_reader
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
    service_account = google_service_account.app_runner.email

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
    google_cloud_run_v2_service.demo_backend,
    google_artifact_registry_repository_iam_member.app_runner_ar_reader
  ]
}

resource "google_cloud_run_v2_service_iam_member" "demo_webapp_public" {
  project  = local.project_id
  location = local.region
  name     = google_cloud_run_v2_service.demo_webapp.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
