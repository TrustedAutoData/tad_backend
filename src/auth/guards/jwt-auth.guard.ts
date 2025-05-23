import { Injectable, ExecutionContext, CanActivate, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private authService: AuthService) {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }
    if (!user.sessionId || new Date(user.expiresAt) < new Date()) {
      await this.authService.logout(user.id);
      return false;
    }
    const token = request.cookies?.['TAD-Access-Token'];
    const tokenIsValid = token && (await this.authService.validateAuthToken(token));
    return tokenIsValid;
  }
}