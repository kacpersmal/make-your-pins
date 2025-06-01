# Thumbnail Generator

Cloud Function that generates thumbnails for images uploaded to Google Cloud Storage.

## Development

This project uses TypeScript and Google TypeScript Style (GTS).

### Setup

```bash
npm install
```

### Local Development

```bash
npm start
```

This runs the function locally using the Functions Framework.

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript.

### Lint and Fix

```bash
npm run lint
npm run fix
```

### Clean

```bash
npm run clean
```

Removes build artifacts.

## Deployment

The function is deployed via Terraform to Google Cloud Functions. See the terraform directory for details.

## Architecture

This function is triggered when a file is uploaded to a Cloud Storage bucket. It processes image files to create thumbnails.
