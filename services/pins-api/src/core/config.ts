export const config = {
  server: {
    port: parseInt(process.env.PORT || '8080'),
    host: '0.0.0.0',
    logger: process.env.NODE_ENV !== 'production',
  },
  cors: {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
  storage: {
    bucketName: process.env.GCS_BUCKET_NAME || 'your-default-bucket-name',
    urlExpirySeconds: parseInt(process.env.GCS_URL_EXPIRY_SECONDS || '900'), // 15 minutes
  },
};
