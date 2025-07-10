import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {User, convertToUserProfile} from '../models';
import {UserRepository} from '../repositories';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET ?? 'your-secret-key';
  private jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '24h';

  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
  ) {}

  async register(userData: RegisterData): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: {email: userData.email},
    });

    if (existingUser) {
      throw new HttpErrors.BadRequest('Email already in use');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  async login(loginData: LoginData): Promise<{user: User; token: string}> {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: {email: loginData.email},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Incorrect email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpErrors.Unauthorized('Incorrect email or password');
    }

    // Generate JWT token
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, this.jwtSecret);

    return {user, token};
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      // Find user to ensure it still exists
      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        throw new HttpErrors.Unauthorized('Invalid token');
      }

      return convertToUserProfile(user);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }
    return user;
  }
}
