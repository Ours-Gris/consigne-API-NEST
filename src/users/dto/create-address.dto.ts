import { IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {

    @IsOptional()
    @IsString()
    readonly address!: string;

    @IsOptional()
    @IsString()
    readonly address_details!: string;

    @IsOptional()
    @IsString()
    readonly postal_code!: string;

    @IsOptional()
    @IsString()
    readonly city!: string;
}
