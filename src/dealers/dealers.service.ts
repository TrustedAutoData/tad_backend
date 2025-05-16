import { Injectable } from '@nestjs/common';

@Injectable()
export class DealersService {
  findAll(search?: string) {
    return [];
  }
  findOne(id: string) {
    return { id };
  }
}
