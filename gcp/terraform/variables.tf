variable "service_name_suffix" {
  description = "Short suffix used in Cloud Run service names for this stack."
  type        = string
  default     = "demo"

  validation {
    condition     = can(regex("^[a-z0-9-]{1,20}$", var.service_name_suffix))
    error_message = "service_name_suffix must be 1-20 characters using lowercase letters, digits, or hyphens."
  }
}

variable "plainflags_deployment_name_suffix" {
  description = "Suffix passed to the upstream Plain Flags Terraform module."
  type        = string
  default     = "pf"

  validation {
    condition     = can(regex("^[a-z0-9-]{1,12}$", var.plainflags_deployment_name_suffix))
    error_message = "plainflags_deployment_name_suffix must be 1-12 characters using lowercase letters, digits, or hyphens."
  }
}

variable "superadmin_email" {
  description = "Superadmin email required by the Plain Flags module."
  type        = string
}

variable "firebase_auth_domain" {
  description = "Firebase auth domain required by the Plain Flags dashboard runtime."
  type        = string
}

variable "firebase_api_key" {
  description = "Firebase API key required by the Plain Flags dashboard runtime."
  type        = string
  sensitive   = true
}

variable "firebase_app_id" {
  description = "Firebase app ID required by the Plain Flags dashboard runtime."
  type        = string
}
