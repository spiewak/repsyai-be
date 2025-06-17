terraform {
  backend "s3" {
    bucket         = "repsyai-terraform-state"
    key            = "terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "repsyai-terraform-locks"
    encrypt        = true
  }
} 