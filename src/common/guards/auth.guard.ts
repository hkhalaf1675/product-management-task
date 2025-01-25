import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { FailResponseDto } from "../dtos/fail.response.dto";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import dataSource from "src/database/data-source";
import { User, UserRole } from "src/modules/users/entities/user.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) {}

    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException(new FailResponseDto(
                ['A token is required for authentication!'],
                'Unauthorized User',
                401
            ));
        }
        let userId;
        try {
            const { user } = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('jwt.secret')
            });

            if(!user){
                throw new UnauthorizedException(new FailResponseDto(
                    ['Token was expired'],
                    'Unauthorized User',
                    401
                ));
            }

            userId = user.sub;
        } catch (error) {
            throw new UnauthorizedException(new FailResponseDto(
                ['Token was expired'],
                'Unauthorized User',
                401
            ));
        }

        const myDataSource = dataSource;
        if(!myDataSource.isInitialized){
            await myDataSource.initialize();
        }

        const foundUser = await myDataSource.manager.findOneBy(User, {id: userId});

        if(!foundUser){
            throw new UnauthorizedException(new FailResponseDto(
                ['Token was expired'],
                'Unauthorized User',
                401
            ));
        }

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        delete foundUser.password;
        request['user'] = foundUser;

        if(!requiredRoles){
            return true;
        }

        if(requiredRoles.some(role => role == foundUser.role)){
            return true;
        }

        throw new UnauthorizedException(new FailResponseDto(
            ['You are not authorized to access this resource!'],
            'Unauthorized User',
            401
        ));
    }

    private extractTokenFromHeader(request: Request): string | undefined{
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return (type == 'Bearer') ? token : undefined;
    }
}