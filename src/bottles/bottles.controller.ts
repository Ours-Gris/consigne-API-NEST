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
import { BottlesService } from './bottles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { BottleEntity } from './entities/bottle.entity';
import { CreateBottleDto } from './dto/create-bottle.dto';
import { UpdateBottleDto } from './dto/update-bottle.dto';
import { UpdateResult } from 'typeorm';

@Controller('bottles')
export class BottlesController {

    constructor(
        private readonly bottlesService: BottlesService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findBottles(
        @Query('_sort', new DefaultValuePipe('name')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<BottleEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.bottlesService.findBottles(start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countBottles(): Promise<Number> {
        return await this.bottlesService.countBottles();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createBottle(@Body() newBottle: CreateBottleDto): Promise<BottleEntity> {
        return await this.bottlesService.createBottle(newBottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updateBottle(@Param('id') id: string, @Body() bottle: UpdateBottleDto): Promise<BottleEntity> {
        return await this.bottlesService.updateBottle(id, bottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteBottle(@Param('id') id: string): Promise<UpdateResult> {
        return await this.bottlesService.deleteBottle(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('recover/:id')
    async restoreBottle(@Param('id') id: string): Promise<UpdateResult> {
        return await this.bottlesService.restoreBottle(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneBottle(@Param('id') id: string): Promise<BottleEntity> {
        return await this.bottlesService.findOneBottleById(id);
    }
}
