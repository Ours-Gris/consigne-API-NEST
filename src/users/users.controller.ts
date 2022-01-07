import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get, NotFoundException,
    Param,
    ParseIntPipe, Post,
    Put,
    Query, Res, UploadedFile,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PayloadInterface } from './interfaces/payload.interface';
import { EmailUniqueGuard } from '../auth/guards/email-unique.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../utils/file-upload.utils';
import { existsSync } from 'fs';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findUsers(
        @Query('_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('username')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<UserEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.usersService.findUsers(contains, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('waiting')
    async findUsersWaitingPassage(
        @Query('_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('collecte_status')) sortBy,
        @Query('_direction', new DefaultValuePipe('DESC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<UserEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.usersService.findUsersWaitingPassage(contains, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('export')
    async findAll(): Promise<UserEntity[]> {
        return await this.usersService.findAllForExport();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countUsers(): Promise<Number> {
        //TODO filter sur le count ?
        return await this.usersService.countUsers();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('waiting/count')
    async countUsersWaiting(): Promise<Number> {
        return await this.usersService.countUsersWaiting();
    }

    @UseGuards(JwtAuthGuard, EmailUniqueGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createUser(
        @Body() newUser: CreateUserDto
    ): Promise<UserEntity> {
        return await this.usersService.createUser(newUser);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMe(@User() payload: PayloadInterface): Promise<UserEntity> {
        return await this.usersService.findMe(payload.sub);
    }

    @Get('producers')
    async getProducers(
        @Query('_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('username')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<UserEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        const where = {
            producer: true
        };
        return await this.usersService.findUsersCompany(contains, start, limit, order, where);
    }

    @Get('producers/count')
    async countProducers(): Promise<Number> {
        return await this.usersService.countUsersCustom({ producer: true });
    }

    @Get('resellers')
    async getResellers(
        @Query('_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('username')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<UserEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        const where = {
            reseller: true
        };
        return await this.usersService.findUsersCompany(contains, start, limit, order, where);
    }

    @Get('resellers/count')
    async countResellers(): Promise<Number> {
        return await this.usersService.countUsersCustom({ reseller: true });
    }

    //TODO faille de secu un user pourrait changer son role facilement
    @UseGuards(JwtAuthGuard)
    @Put('me')
    @UseInterceptors(
        FileInterceptor(
            'img_user',
            {
                fileFilter: fileFilter
            }))
    async updateMe(
        @User() payload: PayloadInterface,
        @Body() user: UpdateUserDto,
        @UploadedFile() fileMulter: Express.Multer.File
    ): Promise<UserEntity> {
        return await this.usersService.updateUser(payload.sub, user, fileMulter);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    @UseInterceptors(
        FileInterceptor(
            'img_user',
            {
                fileFilter: fileFilter
            }))
    async updateUser(
        @Param('id') id: string,
        @Body() user: UpdateUserDto,
        @UploadedFile() fileUser: Express.Multer.File
    ): Promise<UserEntity> {
        return await this.usersService.updateUser(id, user, fileUser)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<DeleteResult> {
        return await this.usersService.deleteUser(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneUser(@Param('id') id: string): Promise<UserEntity> {
        return await this.usersService.findOneUserById(id);
    }

    @Get('public/:id')
    async findOneUserPublic(@Param('id') id: string): Promise<UserEntity> {
        return await this.usersService.findUserPublic(id);
    }

    @Get('file/:filePath')
    seeUploadedFile(@Param('filePath') fileName, @Res() res) {
        let filePath = process.env.PATH_FILES_LOGO + fileName;
        if (existsSync(filePath)) {
            return res.sendFile(fileName, {
                root: process.env.PATH_FILES_LOGO
            });
        }
        throw new NotFoundException();
    }
}
