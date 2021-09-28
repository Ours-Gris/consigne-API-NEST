import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBottleDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly code: string;

    @IsNotEmpty()
    @IsString()
    readonly nbr_by_palette: string;

    @IsNotEmpty()
    @IsString()
    readonly internal_stock: string;

    @IsOptional()
    @IsString()
    img_original_name: string;

    @IsOptional()
    @IsString()
    img_name: string;
}
