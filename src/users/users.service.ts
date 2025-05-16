import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  findAll(search?: string) {
    return [];
  }

  create(dto: CreateUserDto) {
    return { id: 'new-user', ...dto, points: 0, level: 1 };
  }

  findOne(id: string) {
    return { id };
  }

  getPointsHistory(id: string) {
    return { data: [] };
  }
}
