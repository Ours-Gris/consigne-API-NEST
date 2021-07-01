import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
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

    @IsString()
    company!: string;

    @IsString()
    adress!: string;

    @IsString()
    adress_details!: string;

    @IsString()
    postal_code!: string;

    @IsString()
    city!: string;

    @IsString()
    tel!: string;

    @IsNotEmpty()
    @IsEnum(UserRole)
    readonly role: UserRole;
}
