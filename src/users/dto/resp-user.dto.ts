import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';

export class RespUserDto {

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsEnum(UserRole)
    role: UserRole;

}
