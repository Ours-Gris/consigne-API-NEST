import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';

export class UpdatePassageDto {

    @IsNotEmpty()
    @IsInt()
    bottles_collected: number;

    @IsOptional()
    @Type( () => UserEntity)
    readonly user: UserEntity;
}
