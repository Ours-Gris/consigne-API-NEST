import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupUserDto } from './dto/signup-user.dto';
import { UserRole } from '../enums/user.role';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {
    }

    async validateUser(identifier: string, enteredPassword: string): Promise<Partial<UserEntity>> {
        const user: UserEntity = await this.usersService.findOneUserByIdentifier(identifier);
        if (!user) {
            return null;
        }
        const match = await AuthService.comparePassword(enteredPassword, user.password);
        if (!match) {
            return null;
        }
        const { password, ...result } = user;
        return result;
    }

    async login(user: Partial<UserEntity>) {
        const token = await this.generateToken(user);
        return { user, token };
    }

    public async signUp(user: SignupUserDto) {
        if (user.role === UserRole.ADMIN) {
            throw new UnauthorizedException()
        }
        const pass: string = await AuthService.hashPassword(user.password);
        const newUser = await this.usersService.createUser({ ...user, password: pass });

        const { password, ...result } = newUser;
        const token = await this.generateToken(result);

        return { user: result, token };
    }

    private async generateToken(user) {
        return await this.jwtService.signAsync(user);
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    private static async comparePassword(enteredPassword, dbPassword) {
        return await bcrypt.compare(enteredPassword, dbPassword);
    }
}
