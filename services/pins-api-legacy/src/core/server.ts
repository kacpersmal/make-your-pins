import {buildApp} from './app';
import {config} from './config';

export async function startServer() {
  const server = await buildApp();

  try {
    await server.listen({
      port: config.server.port,
      host: config.server.host,
    });

    if (server && server.server) {
      server.log.info(
        `Server is running on port ${server?.server?.address()?.toString() || config.server.port}`,
      );
    } else {
      server.log.error('Server instance is not available');
    }

    return server;
  } catch (err) {
    server.log.error(err);
    throw err;
  }
}
