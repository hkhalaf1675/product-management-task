import { Controller, Post, Body, HttpCode, UseGuards, Get, Request} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SuccessResponseDto } from 'src/common/dtos/success.response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';

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

  @UseGuards(AuthGuard)
  @Get('users/my-profile')
  @ApiTags('Users')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  findUserProfile(@Request() req: any){
    return new SuccessResponseDto(
      '',
      { user: req.user },
      200
    );
  }
}
