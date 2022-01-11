import { IsOptional, IsString } from 'class-validator';

export class UpdateQuestionDto {
    @IsOptional()
    @IsString()
    readonly label: string;

    @IsOptional()
    @IsString()
    readonly answer: string;
}
