import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
    readonly company!: string;

    @IsOptional()
    @IsString()
    readonly adress!: string;

    @IsOptional()
    @IsString()
    readonly adress_details!: string;

    @IsOptional()
    @IsString()
    readonly postal_code!: string;

    @IsOptional()
    @IsString()
    readonly city!: string;

    @IsOptional()
    @IsString()
    readonly tel!: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    readonly role: UserRole;

    @IsOptional()
    @IsBoolean()
    readonly reseller!: boolean;

    @IsOptional()
    @IsBoolean()
    readonly producer!: boolean;
}
