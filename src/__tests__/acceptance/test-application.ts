import {ApplicationConfig} from '@loopback/core';
import {SecurityBindings, securityId} from '@loopback/security';
import * as jwt from 'jsonwebtoken';
import {LoopbackPrismaToHonoDrizzleApplication} from '../../application';

interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
}

export class TestApplication extends LoopbackPrismaToHonoDrizzleApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Middleware to process JWT in tests
    this.middleware((ctx, next) => {
      const request = ctx.request;
      const response = ctx.response;
      const authHeader = request.headers.authorization;

      // Check if it's an endpoint that requires authentication
      const requiresAuth = request.url?.startsWith('/tasks') ?? false;

      if (requiresAuth && !authHeader?.startsWith('Bearer ')) {
        // No token on endpoint that requires authentication
        response.status(401).json({
          error: {
            statusCode: 401,
            name: 'UnauthorizedError',
            message: 'Authorization header not found.',
          },
        });
        return;
      }

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.slice(7);

        try {
          const jwtSecret = process.env.JWT_SECRET ?? 'your-secret-key';
          const payload = jwt.verify(token, jwtSecret) as JwtPayload;

          // Create a UserProfile from JWT token
          const userProfile = {
            [securityId]: payload.userId,
            id: payload.userId,
            email: payload.email,
            name: payload.name,
          };

          // Bind user to context
          ctx.bind(SecurityBindings.USER).to(userProfile);
        } catch (error) {
          // Invalid token on endpoint that requires authentication
          if (requiresAuth) {
            response.status(401).json({
              error: {
                statusCode: 401,
                name: 'UnauthorizedError',
                message: 'Invalid token.',
              },
            });
            return;
          }
        }
      }

      return next();
    });
  }
}
