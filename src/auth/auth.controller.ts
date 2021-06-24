import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SignupUserDto } from './dto/signup-user.dto';
import { DoesUserExist } from './guards/doesUserExist.guard';
import { User } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user) {
        return this.authService.login(user);
    }

    @UseGuards(DoesUserExist)
    @Post('signup')
    async signUp(@Body() user: SignupUserDto) {
        return await this.authService.signUp(user);
    }
}
