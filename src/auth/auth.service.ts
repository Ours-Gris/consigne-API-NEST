import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../enums/user.status';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly mailerService: MailerService,
        private readonly jwtService: JwtService
    ) {}

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

    public async addUser(user: CreateUserDto) {
        const newUser = await this.usersService.createUser(user);
        return await this.sendWelcome(newUser)
    }

    public async sendWelcome(user: UserEntity) {
        const token = await this.generateToken(user);
        const forgotLink = `${process.env.APP_CORS_ORIGIN}/auth/new-password?welcome=true&token=${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Bienvenue sur Oc\'consigne',
            html: `
                <h3>Bienvenue ${user.username}!</h3>
                <p>Voila un lien pour valider votre email et définir votre mots de passe : <a href="${forgotLink}">Oc'consigne</a></p>
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
    }

    public async confirm(user: UserEntity) {
        if (user.status === UserStatus.PENDING) {
            user.status = UserStatus.ACTIVE;
            return await this.usersService.updateUser(user.id, user);
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
        if (!enteredPassword) {
            return null
        }
        return await bcrypt.compare(enteredPassword, dbPassword);
    }
}
