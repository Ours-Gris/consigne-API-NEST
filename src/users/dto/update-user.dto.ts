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
    @IsString()
    company!: string;

    @IsOptional()
    @IsString()
    adress!: string;

    @IsOptional()
    @IsString()
    adress_details!: string;

    @IsOptional()
    @IsString()
    postal_code!: string;

    @IsOptional()
    @IsString()
    city!: string;

    @IsOptional()
    @IsString()
    tel!: string;

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    status!: UserStatus;
}
