import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../enums/user.role';
import { UserStatus } from '../../enums/user.status';
import { Type } from 'class-transformer';
import { UpdateAddressDto } from './update-address.dto';

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    readonly username: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    readonly email: string;

    @IsOptional()
    @IsString()
    readonly password!: string;

    @IsOptional()
    @IsString()
    readonly company!: string;

    @IsOptional()
    @IsString()
    readonly tel!: string;

    @IsOptional()
    @Type(() => UpdateAddressDto)
    readonly address!: UpdateAddressDto;

    @IsOptional()
    @Type(() => UpdateAddressDto)
    readonly delivery_address!: UpdateAddressDto;

    @IsOptional()
    @IsEnum(UserRole)
    readonly role: UserRole;

    @IsOptional()
    @IsEnum(UserStatus)
    readonly status!: UserStatus;

    @IsOptional()
    @IsBoolean()
    readonly reseller: boolean;

    @IsOptional()
    @IsBoolean()
    readonly producer: boolean;

    @IsOptional()
    @IsString()
    readonly delivery_schedules!: string;

    @IsOptional()
    @IsString()
    readonly delivery_data!: string;

    @IsOptional()
    @IsBoolean()
    readonly heavy_truck!: boolean;

    @IsOptional()
    @IsBoolean()
    readonly stacker!: boolean;

    @IsOptional()
    @IsBoolean()
    readonly forklift!: boolean;

    @IsOptional()
    @IsBoolean()
    readonly pallet_truck!: boolean;
}
