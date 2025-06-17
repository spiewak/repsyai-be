variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "openai_api_key" {
  description = "OpenAI API Key"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google Client ID for social login"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google Client Secret for social login"
  type        = string
  sensitive   = true
}
