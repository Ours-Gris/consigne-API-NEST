import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';

export class SignupUserDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    company!: string;

    // @IsOptional()
    // @IsString()
    // adress!: string;
    //
    // @IsOptional()
    // @IsString()
    // adress_details!: string;
    //
    // @IsOptional()
    // @IsString()
    // postal_code!: string;
    //
    // @IsOptional()
    // @IsString()
    // city!: string;

    @IsOptional()
    @IsString()
    tel!: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @IsOptional()
    @IsBoolean()
    readonly reseller!: boolean;

    @IsOptional()
    @IsBoolean()
    readonly producer!: boolean;
}
