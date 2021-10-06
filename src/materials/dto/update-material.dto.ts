import { IsOptional, IsString } from 'class-validator';

export class UpdateMaterialDto {

    @IsOptional()
    @IsString()
    readonly name: string;

    @IsOptional()
    @IsString()
    readonly description: string;

    @IsOptional()
    @IsString()
    price: string;

    @IsOptional()
    @IsString()
    readonly code: string;

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
