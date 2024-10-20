import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto) {
    try {
      const { password, username } = authCredentialsDto;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);

      return user;
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(authCredentialsDto: AuthCredentialsDto) {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ username });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException(
        'Invalid Credentials: Please check your username and password',
      );

    const payload: JwtPayloadInterface = { id: user.id, username };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
