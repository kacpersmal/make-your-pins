import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { FirebaseService } from 'src/shared/services/firebase.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-jwt',
) {
  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const decodedToken = await this.firebaseService
        .getApp()
        .auth()
        .verifyIdToken(token);

      if (!decodedToken) {
        throw new UnauthorizedException('Invalid token');
      }

      // Add user data to request
      return {
        userId: decodedToken.uid,
        email: decodedToken.email,
        roles: decodedToken.roles || [],
      };
    } catch (error) {
      throw new UnauthorizedException(
        `Token verification failed: ${error.message}`,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return undefined;

    const [bearer, token] = authHeader.split(' ');
    return bearer.toLowerCase() === 'bearer' ? token : undefined;
  }
}
