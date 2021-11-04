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

    @IsNotEmpty()
    @IsString()
    readonly internal_stock_dirty: string;

    @IsOptional()
    @IsString()
    price: string;

    @IsOptional()
    @IsString()
    img_original_name: string;

    @IsOptional()
    @IsString()
    img_name: string;

    @IsOptional()
    @IsString()
    pdf_original_name: string;

    @IsOptional()
    @IsString()
    pdf_name: string;
}
