import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { User } from '../decorators/user.decorator';
import { EmailValidGuard } from './guards/email-valid.guard';
import { EmailUniqueGuard } from './guards/email-unique.guard';
import { UserEntity } from '../users/entities/user.entity';
import { EmailConfirmGuard } from './guards/email-confirm.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user) {
        return this.authService.login(user);
    }

    @UseGuards(EmailUniqueGuard)
    @Post('signup')
    async signUp(@Body() user: SignupUserDto) {
        return await this.authService.signUp(user);
    }

    @UseGuards(EmailValidGuard)
    @Post('reset')
    async resetPassword(@User() user: UserEntity) {
        return await this.authService.resetPassword(user);
    }

    @UseGuards(EmailConfirmGuard)
    @Post('confirm')
    async confirm(@User() user: UserEntity) {
        return await this.authService.confirm(user);
    }
}
