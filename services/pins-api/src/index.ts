import {startServer} from './core/server';
import 'dotenv/config';

// Start the server and handle errors
startServer().catch(err => {
  console.error('Failed to start server:', err);
  throw err;
});
