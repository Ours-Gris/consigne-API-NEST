import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'identifier' });
    }

    async validate(identifier: string, password: string): Promise<Partial<UserEntity>> {
        const user = await this.authService.validateUser(identifier, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
