import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const logger = new Logger('CurrentUser');
    const request = ctx.switchToHttp().getRequest();

    logger.debug(`Request user: ${JSON.stringify(request.user || {})}`);

    if (!request.user) {
      logger.debug(`No user found in request, returning undefined`);
      return undefined;
    }

    if (data) {
      logger.debug(`Extracting '${data}' from user: ${request.user[data]}`);
      return request.user[data];
    }

    return request.user;
  },
);
