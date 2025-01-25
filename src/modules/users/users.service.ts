import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FailResponseDto } from '../../common/dtos/fail.response.dto';
import { SuccessResponseDto } from '../../common/dtos/success.response.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}
  
  async register(registerDto: RegisterDto){
    // check if there is old users with the same email
    const oldUser = await this.userRepository.findOneBy({email: registerDto.email});

    if(oldUser){
      throw new BadRequestException(new FailResponseDto(
        ['There is already user exists with the same email'],
        'Validation Error',
        400
      ));
    }
    let newUser = this.userRepository.create(registerDto);
    newUser = await this.userRepository.save(newUser);

    const token = await this.jwtService.signAsync({
      user: { sub: newUser.id, email: newUser.email, role: newUser.role }
    });

    delete newUser.password;
    return new SuccessResponseDto(
      'You have been registered successfully',
      { user: newUser, token },
      200
    );
  }

  async login(loginDto: LoginDto){
    const user = await this.userRepository.findOneBy({email: loginDto.email});
    if(!user){
      throw new UnauthorizedException(new FailResponseDto(
        ['There was a problem logging in. Check your email and password or create an account.'],
        'Validation Error!',
        401
      ));
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if(!isMatch){
      throw new UnauthorizedException(new FailResponseDto(
        ['There was a problem logging in. Check your email and password or create an account.'],
        'Validation Error!',
        401
      ));
    }

    const token = await this.jwtService.signAsync({
      user: { sub: user.id, email: user.email, role: user.role }
    });

    delete user.password;
    return new SuccessResponseDto(
      'Login Succssefully',
      { user, token },
      200
    );
  }
}
