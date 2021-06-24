import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.TOKEN_SECRET,
            signOptions: {
                expiresIn: process.env.TOKEN_TIME
            }
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, RolesGuard],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {
}
