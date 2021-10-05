import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get, NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, Res, UploadedFile, UploadedFiles,
    UseGuards, UseInterceptors
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
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, pdfFileFilter } from '../utils/file-upload.utils';
import { existsSync } from 'fs';

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
        @Query('name_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('name')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<BottleEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.bottlesService.findBottles(contains, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('export')
    async findAll(): Promise<BottleEntity[]> {
        return await this.bottlesService.findAll();
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
    @UseInterceptors(
        FileInterceptor(
            'img_bottle',
            {
                storage: diskStorage({ destination: process.env.PATH_FILES_BOTTLE }),
                fileFilter: fileFilter
            }))
    @UseInterceptors(
        FileInterceptor(
            'pdf_bottle',
            {
                storage: diskStorage({ destination: process.env.PATH_FILES_BOTTLE }),
                fileFilter: pdfFileFilter
            }))
    async createBottle(
        @Body() newBottle: CreateBottleDto,
        @UploadedFile() imgBottle: Express.Multer.File,
        @UploadedFile() pdfBottle: Express.Multer.File
    ): Promise<BottleEntity> {
        return await this.bottlesService.createBottle(newBottle, imgBottle, pdfBottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'img_bottle', maxCount: 1 },
                { name: 'pdf_bottle', maxCount: 1 }
            ], {
                storage: diskStorage({ destination: process.env.PATH_FILES_BOTTLE }),
                fileFilter: fileFilter
            }
        ))
    async updateBottle(
        @Param('id') id: string,
        @Body() bottle: UpdateBottleDto,
        @UploadedFiles() filesBottle: { img_bottle?: Express.Multer.File[], pdf_bottle?: Express.Multer.File[] }
    ): Promise<BottleEntity> {
        return await this.bottlesService.updateBottle(id, bottle, filesBottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteBottle(@Param('id') id: string): Promise<UpdateResult> {
        return await this.bottlesService.deleteBottle(id);
    }

    @Get('file/:filePath')
    seeUploadedFile(@Param('filePath') fileName, @Res() res) {
        let filePath = process.env.PATH_FILES_BOTTLE + fileName;
        if (existsSync(filePath)) {
            return res.sendFile(fileName, {
                root: process.env.PATH_FILES_BOTTLE
            });
        }
        throw new NotFoundException();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneBottle(@Param('id') id: string): Promise<BottleEntity> {
        return await this.bottlesService.findOneBottleById(id);
    }
}
