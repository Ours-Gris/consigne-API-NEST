import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';

export class CreatePassageDto {

    @IsNotEmpty()
    @IsInt()
    bottles_collected: number;

    @IsNotEmpty()
    @Type( () => UserEntity)
    user: UserEntity;
}
