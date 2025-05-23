import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AuthException } from 'src/core/exceptions/auth.exceptions';
import { LoginWithPrivyDto } from '../DTO/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrivyService } from 'src/privy/privy.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { UsersService } from 'src/users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
  ) {}
  @Inject()
  private privyService: PrivyService;
  @Inject()
  private jwtService: JwtService;
  @Inject()
  private configService: ConfigService;
  @Inject()
  private userService: UsersService;
  @InjectRepository(User)
  private userRepository: Repository<User>;

  private async generateJwtTokenPrivy(user: User): Promise<string> {
    const accessToken = this.jwtService.sign({
      iat: Number((Date.now() / 1000).toFixed(0)),
      userId: user.id,
      email: user.email,
      firstName: user.name,
      lastName: '',
    });
    return accessToken;
  }

  async validateAuthToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return true;
    } catch {
      return false;
    }
  }

  async validateUserByPrivyAccessToken(privyAccessToken: string) {
    try {
      const { userId } = await this.privyService.client.verifyAuthToken(privyAccessToken);
      const user = await this.userRepository.findOne({ where: { privyId: userId } });
      if (!user) {
        throw new AuthException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }
      throw new AuthException('Invalid credentials');
    }
  }

  async loginWithPrivy(loginWithPrivyDto: LoginWithPrivyDto, sessionId?: string) {
    try {
      const { privyAccessToken } = loginWithPrivyDto;
      const user = await this.validateUserByPrivyAccessToken(privyAccessToken);
      const accessToken = await this.generateJwtTokenPrivy(user);
      const newSessionId = sessionId || crypto.randomUUID();
      const expiresAt = new Date(Date.now() + Number(this.configService.get('SESSION_MAX_AGE') || 86400000));
      user.sessionId = newSessionId;
      user.expiresAt = expiresAt;
      await this.userRepository.save(user);
      return { ...user, accessToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }
      throw new AuthException('Cannot authorize the user');
    }
  }

  async registerWithPrivy(userCreateDto: CreateUserDto, sessionId?: string) {
    try {
      const user = await this.userService.create(userCreateDto);
      const newSessionId = sessionId || crypto.randomUUID();
      const expiresAt = new Date(Date.now() + Number(this.configService.get('SESSION_MAX_AGE') || 86400000));
      user.sessionId = newSessionId;
      user.expiresAt = expiresAt;
      await this.userRepository.save(user);
      const accessToken = await this.generateJwtTokenPrivy(user);
      return { ...user, accessToken };
    } catch (error) {
      if (error instanceof AuthException) {
        throw error;
      }
      throw new AuthException('Cannot register the user');
    }
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.sessionId = '';
      user.expiresAt = null;
      await this.userRepository.save(user);
    }
  }
}