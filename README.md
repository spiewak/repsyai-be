# RepsyAI Backend

This project contains AWS Lambda functions for workout planning using ChatGPT.

## Prerequisites

- Node.js 18.x
- AWS CLI configured with appropriate credentials
- Terraform installed
- OpenAI API key
- Google Cloud Platform Account (for social login)
- SSL Certificate in AWS Certificate Manager

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `terraform.tfvars` file in the `terraform` directory with your configuration:
```bash
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
```

3. Edit `terraform.tfvars` and fill in your values:
- `aws_region`: Your AWS region
- `openai_api_key`: Your OpenAI API key
- `google_client_id`: Your Google Client ID
- `google_client_secret`: Your Google Client Secret

## Terraform State Management

The project uses S3 and DynamoDB for Terraform state management:

1. S3 bucket (`repsyai-terraform-state`):
   - Stores the Terraform state file
   - Enabled versioning for state history
   - Server-side encryption enabled
   - Prevents accidental deletion

2. DynamoDB table (`repsyai-terraform-locks`):
   - Provides state locking
   - Prevents concurrent modifications
   - Uses pay-per-request billing

To initialize Terraform with the S3 backend:
```bash
cd terraform
terraform init
```

## Social Login Setup

### Google Login
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials:
   - Add authorized redirect URIs (e.g., `https://your-domain.com/callback`)
6. Copy Client ID and Client Secret to `terraform.tfvars`

## Authentication

The API is secured with Amazon Cognito. To make authenticated requests:

1. Use the Cognito Hosted UI to sign in:
```
https://<cognito-domain>/login?client_id=<client-id>&response_type=code&scope=email+openid+profile&redirect_uri=<your-callback-url>
```

2. After successful authentication, you'll receive an ID token and access token.

3. Include the access token in your API requests:
```bash
curl -X POST https://<api-endpoint>/workout \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "training_goal": "weight_loss",
    "time_range": "3_months",
    "body_parts": ["chest", "back", "legs"]
  }'
```

## Security

- All endpoints require authentication via Cognito
- API Gateway uses JWT authorizer to validate tokens
- Social login provider (Google) is configured with secure OAuth flow
- SSL/TLS is required for all communications
- Cognito User Pool enforces strong password policies
- API Gateway has CORS configured for secure cross-origin requests
- Terraform state is encrypted and versioned in S3
- State locking prevents concurrent modifications

## Local Development

1. Start the local API:
```bash
npm run start:local
```

2. Deploy locally with OpenAI API key:
```bash
npm run deploy:local
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## API Endpoints

### POST /workout
Generate a workout plan based on user input.

Request body:
```json
{
  "training_goal": "weight_loss",
  "time_range": "3_months",
  "body_parts": ["chest", "back", "legs"]
}
```

### GET /hello
Simple health check endpoint.

## Infrastructure Components

The Terraform configuration includes:
- Lambda functions with appropriate IAM roles and permissions
- API Gateway HTTP APIs for both functions
- Environment variables for the OpenAI API key
- CloudWatch Logs for monitoring
- VPC configuration (if needed)
- Security groups and network ACLs
- Route tables and internet gateways (if using VPC)

## Cleanup

To remove all created resources:
```bash
terraform destroy
``` 