import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupUserDto } from './dto/signup-user.dto';
import { UserRole } from '../enums/user.role';
import { UserStatus } from '../enums/user.status';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService
    ) {
    }

    async validateUser(email: string, enteredPassword: string): Promise<Partial<UserEntity>> {
        const user: UserEntity = await this.usersService.findOneUserByEmail(email);
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
        return { access_token: token };
    }

    public async signUp(user: SignupUserDto) {
        if (user.role === UserRole.ADMIN) {
            throw new UnauthorizedException();
        }
        const pass: string = await AuthService.hashPassword(user.password);
        const newUser = await this.usersService.createUser({ ...user, password: pass });

        const token = await this.generateToken(newUser);
        await this.sendConfirmation(newUser, token)

        return { access_token: token };
    }

    public async sendConfirmation(user: UserEntity, token: string) {
        const confirmLink = `${process.env.APP_CORS_ORIGIN}/auth/login?token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Verify User',
            html: `
                <h3>Hello ${user.username}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
            `,
        });
    }

    public async resetPassword(user: UserEntity) {
        const token = await this.generateToken(user);
        const forgotLink = `${process.env.APP_CORS_ORIGIN}/auth/new-password?token=${token}`;

        return await this.mailerService.sendMail({
            to: user.email,
            subject: 'Forgot Password',
            text: `Please use this ${forgotLink} to reset your password.`,
            html: `
                <h3>Hello ${user.username}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `
        });

        // Avec Template
        // await this.mailerService.sendMail({
        //     to: 'test@nestjs.com',
        //     from: 'noreply@nestjs.com',
        //     subject: 'Testing Nest Mailermodule with template ✔',
        //     template: 'welcome', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        //     context: {
        //         // Data to be sent to template engine.
        //         code: 'cf1a3f828287',
        //         username: 'john doe'
        //     }
        // });
    }

    public async confirm(user: UserEntity) {
        if (user.status === UserStatus.PENDING) {
            user.status = UserStatus.ACTIVE;
            user = await this.usersService.updateUser(user.id, user);
            return this.login(user)
        }
        throw new BadRequestException('Confirmation error');
    }

    private async generateToken(user): Promise<string> {
        const payload = {
            username: user.username,
            email: user.email,
            sub: user.id,
            role: user.role
        };
        return await this.jwtService.signAsync(payload);
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    private static async comparePassword(enteredPassword, dbPassword) {
        return await bcrypt.compare(enteredPassword, dbPassword);
    }
}
