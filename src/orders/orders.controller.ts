import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { User } from '../decorators/user.decorator';
import { PayloadInterface } from '../users/interfaces/payload.interface';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entities/order.entity';

@Controller('orders')
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('user/:id')
    async getUserMaterials(@Param('id') id: string): Promise<OrderEntity[]> {
        return await this.ordersService.getUserOrders(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMyMaterials(@User() payload: PayloadInterface): Promise<OrderEntity[]> {
        return await this.ordersService.getUserOrders(payload.sub);
    }
}
