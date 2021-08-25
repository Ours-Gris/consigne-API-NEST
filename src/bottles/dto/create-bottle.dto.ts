import { IsNotEmpty, IsString } from 'class-validator';

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

    //image plus tard
}
