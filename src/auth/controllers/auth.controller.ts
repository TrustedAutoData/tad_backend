import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Response } from 'express';
import { AuthenticatedRequest, DefaultRequest } from 'src/types/auth/auth.types';
import { ConfigService } from '@nestjs/config';
import { LoginWithPrivyDto } from '../DTO/auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
  ) {}
  @Inject()
  private authService: AuthService;
  @Inject()
  private readonly configService: ConfigService;

  @Post('/register/privy')
  public async registerWithPrivy(
    @Body() userCreateDto: CreateUserDto,
    @Req() req: DefaultRequest,
    @Res() response: Response,
  ) {
    const user = await this.authService.registerWithPrivy(
      userCreateDto,
      req.sessionID,
    );

    return response
      .status(HttpStatus.CREATED)
      .cookie('TAD-Access-Token', user.accessToken, {
        httpOnly: true,
        domain: this.configService.get<string>('COOKIE_DOMAIN'),
      })
      .json(user);
  }

  @Post('/login/privy')
  public async loginWithPrivy(
    @Body() loginWithPrivyDto: LoginWithPrivyDto,
    @Req() req: DefaultRequest,
    @Res() response: Response,
  ) {
    const user = await this.authService.loginWithPrivy(
      loginWithPrivyDto,
      req.sessionID,
    );

    return response
      .status(HttpStatus.CREATED)
      .cookie('TAD-Access-Token', user.accessToken, {
        httpOnly: true,
        domain: this.configService.get<string>('COOKIE_DOMAIN'),
      })
      .json(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    return res
      .clearCookie('connect.sid')
      .clearCookie('TAD-Access-Token')
      .status(HttpStatus.CREATED)
      .json({ message: 'Logged out successfully' });
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async user(@Req() req: AuthenticatedRequest) {
    return req.user;
  }
}