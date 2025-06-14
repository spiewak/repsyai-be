variable "openai_api_key" {
  description = "OpenAI API key for the workout planner Lambda function"
  type        = string
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "eu-west-1"
} 