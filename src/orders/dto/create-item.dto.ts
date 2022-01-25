import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { MaterialEntity } from '../../materials/entities/material.entity';
import { OrderEntity } from '../entities/order.entity';

export class CreateItemDto {
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @Type(() => MaterialEntity)
    material: MaterialEntity;

    @IsNotEmpty()
    @Type(() => OrderEntity)
    order: OrderEntity;
}
