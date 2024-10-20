import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signup(authCredentialsDto);
  }

  @Post('login')
  login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto);
  }

  @Post('test')
  @UseGuards(AuthGuard())
  test(@Req() req: Request) {
    console.log(req);
  }
}
