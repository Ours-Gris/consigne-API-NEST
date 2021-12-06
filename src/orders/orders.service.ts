import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(OrderEntity)
        private orderRepository: Repository<OrderEntity>
    ) {
    }

    async getUserOrders(idUser: string): Promise<OrderEntity[]> {
        return await this.orderRepository.find({
            relations: ['items'],
            where: { user: idUser }
        });
    }
}
