import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ItemEntity } from './entities/item.entity';
import { PayloadInterface } from '../users/interfaces/payload.interface';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>,
        @InjectRepository(ItemEntity)
        private itemRepository: Repository<ItemEntity>
    ) {
    }

    async getUserOrders(idUser: string): Promise<OrderEntity[]> {
        return await this.orderRepository.find({
            relations: ['items', 'items.material'],
            where: { user: idUser }
        });
    }

    async findOneOrderById(id: string): Promise<OrderEntity> {
        return await this.orderRepository.findOne({
            relations: ['items', 'items.material'],
            where: { id }
        });
    }

    async findOrders(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<OrderEntity[]> {
        return await this.orderRepository.find({
            skip, take, order, relations: ['items', 'items.material'],
            where: {
                label: Like(`%${contains}%`)
            }
        });
    }

    async createOrder(payload: PayloadInterface, order: CreateOrderDto): Promise<OrderEntity> {
        order.user.id = payload.sub
        return  await this.orderRepository.save(order);
    }

    async updateOrder(
        id: string,
        order: UpdateOrderDto
    ): Promise<OrderEntity> {
        // On récupére le order et on remplace les anciennes valeurs
        const targetOrder = await this.orderRepository.preload({
            id,
            ...order
        });
        // tester si le order avec cet id n'existe pas
        if (!targetOrder) {
            throw new NotFoundException();
        }
        if (targetOrder.items && targetOrder.items.length) {
            await this.itemRepository.save(targetOrder.items);
        }
        return await this.orderRepository.save(targetOrder);
    }

    async deleteOrder(id: string): Promise<DeleteResult> {
        return await this.orderRepository.delete(id);
    }

    async countOrders(): Promise<Number> {
        return await this.orderRepository.count();
    }

    async countUserOrders(idUser: string): Promise<Number> {
        return await this.orderRepository.count({ where: { user: idUser } });
    }
}
