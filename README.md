# Make Your Pins - Asset Sharing Platform

A cloud-based platform for sharing and managing digital assets like images, videos, and 3D files, built on Google Cloud Platform.

## 📊 Status

| Service             | Production Status                                                                                                                | Dev Build Status                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Client App          | ![Client App Deployment](https://github.com/kacpersmal/make-your-pins/actions/workflows/deploy-client.yml/badge.svg)             | ![Client App Build](https://github.com/kacpersmal/make-your-pins/actions/workflows/client-app-build.yml/badge.svg) |
| Pins API            | ![Pins API Deployment](https://github.com/kacpersmal/make-your-pins/actions/workflows/deploy-pins-api.yml/badge.svg)             | ![Pins API Build](https://github.com/kacpersmal/make-your-pins/actions/workflows/pins-api-build.yml/badge.svg)     |
| Thumbnail Generator | ![Thumbnail Generator Deployment](https://github.com/kacpersmal/make-your-pins/actions/workflows/deploy-generator.yml/badge.svg) | ![Generator Build](https://github.com/kacpersmal/make-your-pins/actions/workflows/generator-build.yml/badge.svg)   |

## 🚀 Getting Started

- Node.js v20+
- Google Cloud SDK
- Firebase CLI
- Terraform (Only for infra management)
- Git

### Cloning the repo:

```bash
git clone https://github.com/yourusername/make-your-pins.git
cd make-your-pins
```

### 🔧 Service Setup

### 1. Client App

```bash
cd services/client-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase configuration

# Start development server
npm run dev
```

_Environment Variables_

The client app requires the following environment variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=
```

### 2. Pins API

```bash
cd services/pins-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run start:dev
```

_Environment Variables_

The Pins API requires the following environment variables:

```env
PORT=8080
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=
ASSETS_BUCKET_NAME=
```

### 3. Thumbnail Generator

```bash
cd services/thumbnail-generator

# Install dependencies
npm install

# Start development server with Functions Framework
npm start
```

## 🌐 Infrastructure Setup

### Firebase Setup

1. Create a Firebase project or use an existing one
2. Follow the instructions in firebase_setup_instructions.md
3. Enable Authentication with Google and Email/Password providers

### Google Cloud Setup

1. Create a Google Cloud project
2. Enable required APIs:
   - Compute Engine
   - Cloud Storage
   - Cloud Functions
   - Cloud Run
   - Firebase
   - Firestore
   - Artifact Registry

### Terraform Setup

```bash
cd terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars file with your project details
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your project details

# Plan Terraform changes
terraform plan

# Apply Terraform changes
terraform apply
```

## 🚀 Deployment

The project uses GitHub Actions for CI/CD. Each service has its own workflow:

### Client App

```bash
# Manual deployment
cd services/client-app
npm run build
# Files will be in dist/ directory
```

Or trigger the GitHub Actions workflow `deploy-client.yml`

### Pins API

```bash
# Manual deployment
cd services/pins-api
npm run build
# Deploy to Cloud Run with gcloud CLI
```

Or trigger the GitHub Actions workflow `deploy-pins-api.yml`

### Thumbnail Generator

```bash
# Manual deployment
cd services/thumbnail-generator
npm run build
# Deploy to Cloud Functions with gcloud CLI
```

Or trigger the GitHub Actions workflow `deploy-generator.yml`

## 📁 Project Structure

```
.github/workflows/     # GitHub Actions workflows
├── deploy-client.yml  # Client app deployment workflow
├── deploy-generator.yml # Thumbnail generator deployment workflow
└── deploy-pins-api.yml # Pins API deployment workflow

services/
├── client-app/        # React SPA client
├── pins-api/          # NestJS API service
└── thumbnail-generator/ # Cloud Function for asset processing

terraform/             # Infrastructure as Code
├── modules/           # Terraform modules
├── main.tf            # Main Terraform configuration
└── variables.tf       # Terraform variables
```

<hr>
Built with ❤️ using React, NestJS, and Google Cloud Platform.
