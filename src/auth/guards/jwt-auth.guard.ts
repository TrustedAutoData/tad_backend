import { Injectable, ExecutionContext, CanActivate, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')  {
  // private readonly logger = new Logger(JwtAuthGuard.name);

  // constructor(private authService: AuthService) {
  //   super();
  // }

  // public async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const result = (await super.canActivate(context)) as boolean;
  //   if (!result) {
  //     return false;
  //   }
  //   const request = context.switchToHttp().getRequest();
  //   const user = request.user;
  //   if (!user) {
  //     return false;
  //   }
    
  //   return true;
  // }
}