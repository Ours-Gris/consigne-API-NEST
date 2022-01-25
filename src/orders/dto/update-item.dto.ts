import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderEntity } from '../entities/order.entity';
import { MaterialEntity } from '../../materials/entities/material.entity';

export class UpdateItemDto {
    @IsOptional()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @Type(() => MaterialEntity)
    material: MaterialEntity;

    @IsOptional()
    @Type(() => OrderEntity)
    order: OrderEntity;
}
