import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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

interface JwtPayload {
  sub: string; // User ID
  email: string;
}

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

  // async loginWithPrivy(loginWithPrivyDto: LoginWithPrivyDto, sessionId?: string) {
  //   try {
  //     const { privyAccessToken } = loginWithPrivyDto;
  //     const user = await this.validateUserByPrivyAccessToken(privyAccessToken);
  //     const accessToken = await this.generateJwtTokenPrivy(user);
  //     const newSessionId = sessionId || crypto.randomUUID();
  //     const expiresAt = new Date(Date.now() + Number(this.configService.get('SESSION_MAX_AGE') || 86400000));
  //     user.sessionId = newSessionId;
  //     user.expiresAt = expiresAt;
  //     await this.userRepository.save(user);
  //     return { ...user, accessToken };
  //   } catch (error) {
  //     if (error instanceof AuthException) {
  //       throw error;
  //     }
  //     throw new AuthException('Cannot authorize the user');
  //   }
  // }

  private async createUserFromPrivyToken(userPrivyId: string): Promise<User> {
    const { linkedAccounts } = await this.privyService.client.getUserById(userPrivyId);
    const accountWithName: any = linkedAccounts?.find((account: any) => account?.name?.trim());
    const accountWithEmail: any = linkedAccounts?.find((account: any) => account?.email?.trim());

    console.log('linkedAccounts', linkedAccounts);

    const [firstName, lastName] = (accountWithName?.name || '').split(' ');
    const email = accountWithEmail?.email;
    const nickname = email.split('@')[0];

    const newUser = {
      email: email,
      privyId: userPrivyId,
      name: accountWithName?.name || '',
    };

    return this.userService.create(
      newUser
    );
  }

  public async loginWithPrivy(loginWithPrivyDto: LoginWithPrivyDto) {
    try {
      const { privyAccessToken } = loginWithPrivyDto;
      const { userId } = await this.privyService.client.verifyAuthToken(privyAccessToken);
      let user = await this.userService.findByPrivyId(userId);
      // if user with id from token is not created then create one
      if (!user) {
        user = await this.createUserFromPrivyToken(userId);
      }

      console.log('userId', userId, 'privyAccessToken', privyAccessToken, 'user', user);

      const tokenPayload: JwtPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtService.sign(tokenPayload);


      return { user, accessToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Cannot authorize the user with provided Privy token.');
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