import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
  }) {
    const { sub } = payload;
    const user = await this.userRepository.findOne({
      where: { id: sub },
    });
    console.log('sub', sub, 'user', user)

    if (!user) {
      throw new UnauthorizedException();
    }

    // Create a new object without the password
    const { sessionId, ...userWithoutPassword } = user;

    return user;
  }
}