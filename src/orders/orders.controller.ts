import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { User } from '../decorators/user.decorator';
import { PayloadInterface } from '../users/interfaces/payload.interface';
import { OrdersService } from './orders.service';
import { DeleteResult } from 'typeorm';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {

    constructor(
        private readonly ordersService: OrdersService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('user/:id')
    async getUserOrders(@Param('id') id: string): Promise<OrderEntity[]> {
        return await this.ordersService.getUserOrders(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMyOrders(@User() payload: PayloadInterface): Promise<OrderEntity[]> {
        return await this.ordersService.getUserOrders(payload.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('count/me')
    async countMyOrders(@User() payload: PayloadInterface): Promise<Number> {
        return await this.ordersService.countUserOrders(payload.sub);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count/user/:id')
    async countUserOrders(@Param('id') id: string): Promise<Number> {
        return await this.ordersService.countUserOrders(id);
    }

    @Get()
    async findOrders(
        @Query('name_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('name')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<OrderEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.ordersService.findOrders(contains, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countOrders(): Promise<Number> {
        return await this.ordersService.countOrders();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneOrder(@Param('id') id: string): Promise<OrderEntity> {
        return await this.ordersService.findOneOrderById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createOrder(
        @Body() newOrder: CreateOrderDto
    ): Promise<OrderEntity> {
        return await this.ordersService.createOrder(newOrder);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updateOrder(
        @Param('id') id: string,
        @Body() bottle: UpdateOrderDto
    ): Promise<OrderEntity> {
        return await this.ordersService.updateOrder(id, bottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteOrder(@Param('id') id: string): Promise<DeleteResult> {
        return await this.ordersService.deleteOrder(id);
    }
}
