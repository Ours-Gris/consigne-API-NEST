import { IsOptional, IsString } from 'class-validator';

export class UpdateBottleDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    code: string;
}
