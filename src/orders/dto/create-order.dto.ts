import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../enums/order.status';
import { UserEntity } from '../../users/entities/user.entity';
import { Type } from 'class-transformer';
import { CreateItemDto } from './create-item.dto';

export class CreateOrderDto {
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    order_status: OrderStatus;

    @IsNotEmpty()
    @IsArray()
    items: CreateItemDto[];

    @IsNotEmpty()
    @Type(() => UserEntity)
    user: UserEntity;
}
