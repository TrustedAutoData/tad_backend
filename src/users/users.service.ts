import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivyService } from 'src/privy/privy.service';
import { nanoid } from 'nanoid';

interface PostgresError {
  code: string;
  detail?: string;
  table?: string;
  constraint?: string;
}

type PossibleError = Error | PostgresError;

@Injectable()
export class UsersService {
  constructor(
  ) {}
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @Inject()
  private privyService: PrivyService;

  findAll(search?: string) {
    return [];
  }

  private isPostgresError(error: PossibleError): error is PostgresError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Create new user
      const user = this.userRepository.create({
        ...createUserDto,
      });

      // Save user to database
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      // Type guard to check if error is a Postgres error
      if (this.isPostgresError(error) && error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async findByPrivyId(privyId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { privyId },
    });
    
    return user;
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({
      where: { id },
    });;
  }

  getPointsHistory(id: string) {
    return { data: [] };
  }
}
