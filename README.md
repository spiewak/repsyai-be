# Workout Planner API

This project contains two AWS Lambda functions:
1. Workout Planner - Uses ChatGPT to generate workout plans based on user preferences
2. Hello World - A simple Lambda function that returns "Hello World"

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- AWS SAM CLI installed
- Terraform installed
- OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

3. Create deployment packages:
```bash
cd dist/functions/workoutPlanner
zip -r index.zip .
cd ../helloWorld
zip -r index.zip .
```

## Local Development

1. Set your OpenAI API key as an environment variable:
```bash
export OPENAI_API_KEY=your-api-key-here
```

2. Start the local API:
```bash
npm run start:local
```

The API will be available at `http://localhost:3000` with the following endpoints:
- POST http://localhost:3000/workout
- GET http://localhost:3000/hello

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode (useful during development):
```bash
npm run test:watch
```

## Deployment

### Local Deployment with SAM

1. Deploy locally with SAM:
```bash
npm run deploy:local
```

### AWS Deployment with Terraform

1. Navigate to the Terraform directory:
```bash
cd terraform
```

2. Initialize Terraform:
```bash
terraform init
```

3. Create a `terraform.tfvars` file with your OpenAI API key:
```hcl
openai_api_key = "your-api-key-here"
```

4. Deploy the infrastructure:
```bash
terraform apply
```

## API Endpoints

After deployment, you'll get two API endpoints:

1. Workout Planner API:
   - Method: POST
   - Endpoint: `{api-gateway-url}/workout`
   - Request body example:
   ```json
   {
     "trainingGoal": "Strength",
     "time": 60,
     "bodyParts": {
       "Chest": true,
       "Legs": false,
       "Back": true,
       "Abs": true
     }
   }
   ```

2. Hello World API:
   - Method: GET
   - Endpoint: `{api-gateway-url}/hello`

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