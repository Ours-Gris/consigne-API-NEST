import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNewsDto {
    @IsNotEmpty()
    @IsString()
    readonly title: string;

    @IsOptional()
    @IsString()
    readonly subtitle: string;

    @IsNotEmpty()
    @IsString()
    readonly content: string;

    @IsOptional()
    @IsString()
    readonly link: string;

    @IsOptional()
    @IsString()
    img_original_name: string;

    @IsOptional()
    @IsString()
    img_name: string;
}
