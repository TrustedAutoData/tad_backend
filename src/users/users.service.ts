import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivyService } from 'src/privy/privy.service';
import { nanoid } from 'nanoid';

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

  async create(userCreateDto: CreateUserDto): Promise<User> {
    const { privyAccessToken, ...data } = userCreateDto;
  
    const { userId } = await this.privyService.client.verifyAuthToken(privyAccessToken);
    console.log("userId - ", userId);
    const { linkedAccounts } = await this.privyService.client.getUserById(userId);
  
    const accountWithName: any = linkedAccounts?.find((account: any) =>
      account?.name?.trim(),
    );
  
    const accountWithEmail: any = linkedAccounts?.find(
      (account: any) => account?.email?.trim()
    ) || linkedAccounts?.find(
      (account: any) => account?.type === 'email' && account?.address?.trim()
    );
  
    const [privyFirstName, privyLastName] = (accountWithName?.name || '').split(' ');
    const email = accountWithEmail?.email || accountWithEmail?.address;

    // Check if email already exists
    const existingUserByEmail = await this.userRepository.findOne({ where: { email } });
    if (existingUserByEmail) {
      throw new BadRequestException('Email already exists');
    }

    const userData = {
      privyId: userId,
      email: email || `${nanoid()}@example.com`,
      name: data.name || [privyFirstName, privyLastName].filter(Boolean).join(' ') || 'Name',
    };

    // Create and save the new user
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  findOne(id: string) {
    return { id };
  }

  getPointsHistory(id: string) {
    return { data: [] };
  }
}
