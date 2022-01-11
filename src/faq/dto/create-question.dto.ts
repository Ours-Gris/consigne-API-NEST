import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
    @IsNotEmpty()
    @IsString()
    readonly label: string;

    @IsNotEmpty()
    @IsString()
    readonly answer: string;
}
