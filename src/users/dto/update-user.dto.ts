import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';

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
}
