import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {HttpErrors, RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {SecurityBindings, securityId} from '@loopback/security';
import {ServiceMixin} from '@loopback/service-proxy';
import * as jwt from 'jsonwebtoken';
import path from 'path';
import {MySequence} from './sequence';
import {AuthService} from './services';

export {ApplicationConfig};

interface JwtPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
}

export class LoopbackPrismaToHonoDrizzleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // JWT Authentication Middleware
    this.middleware((ctx, next) => {
      const request = ctx.request;
      const authHeader = request.headers.authorization;

      // Check if it's an endpoint that requires authentication
      const requiresAuth = request.url?.startsWith('/tasks') ?? false;

      if (requiresAuth && !authHeader?.startsWith('Bearer ')) {
        // No token on endpoint that requires authentication
        throw new HttpErrors.Unauthorized('Authorization header not found.');
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
            throw new HttpErrors.Unauthorized('Invalid token.');
          }
        }
      }

      return next();
    });

    // Set up the custom sequence
    this.sequence(MySequence);

    // Bind services
    this.bind('services.AuthService').toClass(AuthService);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
