import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly firebase: FirebaseService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Check if the endpoint is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If there's no authorization header and the endpoint is public, allow access
    if (!authHeader && isPublic) {
      return true;
    }

    // For endpoints with auth header, try to validate the token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await this.firebase
          .getApp()
          .auth()
          .verifyIdToken(token);

        // Set the user in the request
        request.user = {
          userId: decodedToken.uid,
        };

        return true;
      } catch (error) {
        // If the endpoint is public, still allow access even with invalid token
        if (isPublic) {
          return true;
        }

        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    // No auth header and not public endpoint
    if (isPublic) {
      return true;
    }

    throw new UnauthorizedException('Missing authorization header');
  }
}
