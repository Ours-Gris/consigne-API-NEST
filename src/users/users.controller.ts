import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EmailUniqueGuard } from '../auth/guards/email-unique.guard';
import { PayloadInterface } from './interfaces/payload.interface';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findUsers(
        @User() user,
        @Query('_sort', new DefaultValuePipe('username')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<UserEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        }
        return await this.usersService.findUsers(start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countUsers(): Promise<Number> {
        return await this.usersService.countUsers();
    }

    @UseGuards(JwtAuthGuard, EmailUniqueGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createUser(@Body() newUser: CreateUserDto): Promise<UserEntity> {
        return await this.usersService.createUserWithHash(newUser);
    }

    @UseGuards(JwtAuthGuard)
    @Put('me')
    async updateMe(@User() payload: PayloadInterface, @Body() user: UpdateUserDto): Promise<UserEntity> {
        return await this.usersService.updateUser(payload.sub, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<UserEntity> {
        return await this.usersService.updateUser(id, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<UpdateResult> {
        return await this.usersService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('recover/:id')
    async restoreUser(@Param('id') id: string): Promise<UpdateResult> {
        return await this.usersService.restoreUser(id);
    }

    //Ouvrir le droit au propiétaire en plus de l'admin
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return await this.usersService.findOneUserById(id);
    }
}
