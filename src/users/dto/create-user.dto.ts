import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly company: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @Type(() => CreateAddressDto)
    readonly address!: CreateAddressDto;

    @IsOptional()
    @Type(() => CreateAddressDto)
    readonly delivery_address!: CreateAddressDto;

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

    @IsOptional()
    @IsBoolean()
    readonly collecte_point!: boolean;

    @IsOptional()
    @IsString()
    readonly delivery_schedules!: string;

    @IsOptional()
    @IsString()
    readonly delivery_data!: string;

    @IsOptional()
    @IsBoolean()
    heavy_truck!: boolean;

    @IsOptional()
    @IsBoolean()
    stacker!: boolean;

    @IsOptional()
    @IsBoolean()
    forklift!: boolean;

    @IsOptional()
    @IsBoolean()
    pallet_truck!: boolean;

    @IsOptional()
    @IsString()
    readonly internal_data!: string;

    @IsOptional()
    @IsString()
    img_original_name: string;

    @IsOptional()
    @IsString()
    img_name: string;
}
