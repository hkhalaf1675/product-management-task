import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SuccessResponseDto } from '../../common/dtos/success.response.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;
  let jwtService: JwtService;

  beforeEach(async () => {
    
    const mockUserRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw BadRequestException if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        role: UserRole.USER,
      };

      userRepository.findOneBy.mockResolvedValue({ email: 'test@example.com' });

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should register a new user and return a token', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password',
        role: UserRole.USER,
      };

      const savedUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
      };

      userRepository.findOneBy.mockResolvedValue(null);
      userRepository.create.mockReturnValue(savedUser);
      userRepository.save.mockResolvedValue(savedUser);

      const result = await service.register(registerDto);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.message).toBe('You have been registered successfully');
      expect(result.data.user).toEqual(savedUser);
      expect(result.data.token).toBe('mock-token');
      expect(userRepository.create).toHaveBeenCalledWith(registerDto);
      expect(userRepository.save).toHaveBeenCalledWith(savedUser);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        user: { sub: savedUser.id, email: savedUser.email, role: savedUser.role },
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user',
      };

      userRepository.findOneBy.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should login successfully and return a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        role: 'user',
      };

      userRepository.findOneBy.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.login(loginDto);

      expect(result).toBeInstanceOf(SuccessResponseDto);
      expect(result.message).toBe('Login Succssefully');
      expect(result.data.user).toEqual({ id: user.id, email: user.email, role: user.role });
      expect(result.data.token).toBe('mock-token');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        user: { sub: user.id, email: user.email, role: user.role },
      });
    });
  });
});