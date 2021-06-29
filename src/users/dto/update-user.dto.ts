import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';
import { UserStatus } from '../../enums/user.status';

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    username: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password!: string;

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status!: UserStatus;
}
