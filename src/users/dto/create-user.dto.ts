import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

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

    @IsNotEmpty()
    @IsEnum(UserRole)
    readonly role: UserRole;
}
