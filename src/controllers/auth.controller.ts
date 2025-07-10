import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody, response} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {AuthService, LoginData, RegisterData} from '../services';

export class AuthController {
  private authService: AuthService;

  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,
  ) {
    this.authService = new AuthService(this.userRepository);
  }

  @post('/auth/register')
  @response(201, {
    description: 'Register new user',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {type: 'string'},
            user: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                email: {type: 'string'},
                name: {type: 'string'},
                createdAt: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password', 'name'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string', minLength: 6},
              name: {type: 'string'},
            },
          },
        },
      },
    })
    userData: RegisterData,
  ): Promise<{message: string; user: any}> {
    try {
      const user = await this.authService.register(userData);
      return {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.BadRequest('Error registering user');
    }
  }

  @post('/auth/login')
  @response(200, {
    description: 'User login',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {type: 'string'},
            token: {type: 'string'},
            user: {
              type: 'object',
              properties: {
                id: {type: 'string'},
                email: {type: 'string'},
                name: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {type: 'string', format: 'email'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    loginData: LoginData,
  ): Promise<{message: string; token: string; user: any}> {
    try {
      const {user, token} = await this.authService.login(loginData);
      return {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      if (error instanceof HttpErrors.HttpError) {
        throw error;
      }
      throw new HttpErrors.Unauthorized('Error logging in');
    }
  }
}
