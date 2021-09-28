import { IsOptional, IsString } from 'class-validator';

export class UpdateBottleDto {

    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    readonly code: string;

    @IsOptional()
    @IsString()
    readonly nbr_by_palette: string;

    @IsOptional()
    @IsString()
    readonly internal_stock: string;

    @IsOptional()
    @IsString()
    img_original_name: string;

    @IsOptional()
    @IsString()
    img_name: string;
}
