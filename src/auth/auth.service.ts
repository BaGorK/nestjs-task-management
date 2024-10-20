import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async signup() {
    console.log(await this.usersRepository.find());
    return 'This action adds a new user';
  }

  async login() {
    return 'This action returns a token';
  }
}
