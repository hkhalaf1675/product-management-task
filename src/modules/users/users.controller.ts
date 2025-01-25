import { Controller, Post, Body, HttpCode} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @Post('auth/register')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 200, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto){
    return await this.usersService.register(registerDto);
  }

  @HttpCode(200)
  @Post('auth/login')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successfully' })
  async login(@Body() loginDto: LoginDto){
    return await this.usersService.login(loginDto);
  }
}
