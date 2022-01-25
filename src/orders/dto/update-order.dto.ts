import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../../enums/order.status';
import { Type } from 'class-transformer';
import { UserEntity } from '../../users/entities/user.entity';
import { UpdateItemDto } from './update-item.dto';

export class UpdateOrderDto {
    @IsOptional()
    @IsEnum(OrderStatus)
    order_status: OrderStatus;

    @IsOptional()
    @IsArray()
    items: UpdateItemDto[];

    @IsOptional()
    @Type(() => UserEntity)
    user: UserEntity;
}
