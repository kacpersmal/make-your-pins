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
};
