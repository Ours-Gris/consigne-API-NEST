import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get, Param,
    ParseIntPipe,
    Post, Put,
    Query, UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { CollecteService } from './collecte.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { CollecteEntity } from './entities/collecte.entity';
import { CreateCollecteDto } from './dto/create-collecte.dto';
import { UpdateCollecteDto } from './dto/update-collecte.dto';
import { UpdateResult } from 'typeorm';
import { User } from '../decorators/user.decorator';
import { PayloadInterface } from '../users/interfaces/payload.interface';

@Controller('collectes')
export class CollecteController {

    constructor(
        private readonly collecteService: CollecteService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('waiting')
    async findCollectes(
        @Query('_sort', new DefaultValuePipe('status')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<CollecteEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.collecteService.findWaitingCollectes(start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('export')
    async findAll(): Promise<CollecteEntity[]> {
        return await this.collecteService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count/waiting')
    async countWaitingCollectes(): Promise<Number> {
        return await this.collecteService.countWaitingCollectes();
    }

    @UseGuards(JwtAuthGuard)
    @Get('count/me')
    async countMyCollectes(@User() payload: PayloadInterface,): Promise<Number> {
        return await this.collecteService.countUserCollectes(payload.sub);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count/:id')
    async countUserCollectes(@Param('id') idUser: string): Promise<Number> {
        return await this.collecteService.countUserCollectes(idUser);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countCollectes(): Promise<Number> {
        return await this.collecteService.countCollectes();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async findMyCollectes(
        @User() payload: PayloadInterface,
        @Query('_sort', new DefaultValuePipe('createdAt')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<CollecteEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.collecteService.findUserCollectes(payload.sub, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('user/:id')
    async findUserCollectes(
        @Param('id') idUser: string,
        @Query('_sort', new DefaultValuePipe('createdAt')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<CollecteEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.collecteService.findUserCollectes(idUser, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneCollecte(@Param('id') id: string): Promise<CollecteEntity> {
        return await this.collecteService.findOneCollecteById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('me')
    async createMyCollecte(@User() payload: PayloadInterface, @Body() newCollecte: CreateCollecteDto): Promise<CollecteEntity> {
        if (String(newCollecte.user) !== payload.sub) {
            throw new UnauthorizedException('You are not authorized to perform the operation')
        }
        return await this.collecteService.createCollecte(newCollecte);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createCollecte(@Body() newCollecte: CreateCollecteDto): Promise<CollecteEntity> {
        return await this.collecteService.createCollecte(newCollecte);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updateCollecte(
        @Param('id') id: string,
        @Body() bottle: UpdateCollecteDto
    ): Promise<CollecteEntity> {
        return await this.collecteService.updateCollecte(id, bottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteCollecte(@Param('id') id: string): Promise<UpdateResult> {
        return await this.collecteService.deleteCollecte(id);
    }
}
