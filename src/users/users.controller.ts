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
import { DoesUserExist } from '../auth/guards/doesUserExist.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllUsers(
        @Query('_sort') sort,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<UserEntity[]> {
        return await this.usersService.findUsers(start, limit);
    }

    @UseGuards(JwtAuthGuard)
    @Get('count')
    async countUsers(): Promise<Number> {
        return await this.usersService.countUsers();
    }

    @UseGuards(JwtAuthGuard)
    @UseGuards(DoesUserExist)
    @Post()
    async createUser(@Body() newUser: CreateUserDto): Promise<UserEntity> {
        console.log(newUser);
        return await this.usersService.createUserWithHash(newUser);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto): Promise<UserEntity> {
        console.log(id)
        return await this.usersService.updateUser(id, user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<UpdateResult> {
        return await this.usersService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('recover/:id')
    async restoreUser(@Param('id') id: string): Promise<UpdateResult> {
        return await this.usersService.restoreUser(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return await this.usersService.findOneUserById(id);
    }
}
