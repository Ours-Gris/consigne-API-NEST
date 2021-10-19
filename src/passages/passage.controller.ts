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
import { PassageService } from './passage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { PassageEntity } from './entities/passage.entity';
import { CreatePassageDto } from './dto/create-passage.dto';
import { UpdatePassageDto } from './dto/update-passage.dto';
import { UpdateResult } from 'typeorm';
import { User } from '../decorators/user.decorator';
import { PayloadInterface } from '../users/interfaces/payload.interface';

@Controller('passages')
export class PassageController {

    constructor(
        private readonly passageService: PassageService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('waiting')
    async findPassages(
        @Query('_sort', new DefaultValuePipe('status')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<PassageEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.passageService.findWaitingPassages(start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('export')
    async findAll(): Promise<PassageEntity[]> {
        return await this.passageService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('waiting/count')
    async countWaitingPassages(): Promise<Number> {
        return await this.passageService.countWaitingPassages();
    }

    @UseGuards(JwtAuthGuard)
    @Get('count/me')
    async countMyPassages(@User() payload: PayloadInterface,): Promise<Number> {
        return await this.passageService.countUserPassages(payload.sub);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count/:id')
    async countUserPassages(@Param('id') idUser: string): Promise<Number> {
        return await this.passageService.countUserPassages(idUser);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countPassages(): Promise<Number> {
        return await this.passageService.countPassages();
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async findMyPassages(
        @User() payload: PayloadInterface,
        @Query('_sort', new DefaultValuePipe('createdAt')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<PassageEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.passageService.findUserPassages(payload.sub, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('user/:id')
    async findUserPassages(
        @Param('id') idUser: string,
        @Query('_sort', new DefaultValuePipe('createdAt')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<PassageEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.passageService.findUserPassages(idUser, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOnePassage(@Param('id') id: string): Promise<PassageEntity> {
        return await this.passageService.findOnePassageById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('me')
    async createMyPassage(@User() payload: PayloadInterface, @Body() newPassage: CreatePassageDto): Promise<PassageEntity> {
        if (String(newPassage.user) !== payload.sub) {
            throw new UnauthorizedException('You are not authorized to perform the operation')
        }
        return await this.passageService.createPassage(newPassage);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createPassage(@Body() newPassage: CreatePassageDto): Promise<PassageEntity> {
        return await this.passageService.createPassage(newPassage);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updatePassage(
        @Param('id') id: string,
        @Body() bottle: UpdatePassageDto
    ): Promise<PassageEntity> {
        return await this.passageService.updatePassage(id, bottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deletePassage(@Param('id') id: string): Promise<UpdateResult> {
        return await this.passageService.deletePassage(id);
    }
}
