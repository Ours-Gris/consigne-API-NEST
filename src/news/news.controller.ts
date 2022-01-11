import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get, NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, Res, UploadedFile,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { DeleteResult } from 'typeorm';
import { NewsService } from './news.service';
import { NewsEntity } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../utils/file-upload.utils';
import { existsSync } from 'fs';

@Controller('news')
export class NewsController {
    constructor(
        private readonly newsService: NewsService
    ) {
    }

    @Get()
    async findNews(
        @Query('_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('title')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<NewsEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.newsService.findNews(contains, start, limit, order);
    }

    @Get('count')
    async countNews(): Promise<Number> {
        return await this.newsService.countNews();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneNews(@Param('id') id: string): Promise<NewsEntity> {
        return await this.newsService.findOneNewsById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    @UseInterceptors(
        FileInterceptor(
            'img_news',
            {
                fileFilter: fileFilter
            }))
    async createNews(
        @Body() newNews: CreateNewsDto,
        @UploadedFile() imgNews: Express.Multer.File
    ): Promise<NewsEntity> {
        return await this.newsService.createNews(newNews, imgNews);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    @UseInterceptors(
        FileInterceptor(
            'img_news',
            {
                fileFilter: fileFilter
            }))
    async updateNews(
        @Param('id') id: string,
        @Body() bottle: UpdateNewsDto,
        @UploadedFile() fileNews: Express.Multer.File
    ): Promise<NewsEntity> {
        return await this.newsService.updateNews(id, bottle, fileNews);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteNews(@Param('id') id: string): Promise<DeleteResult> {
        return await this.newsService.deleteNews(id);
    }

    @Get('file/:filePath')
    seeUploadedFile(@Param('filePath') fileName, @Res() res) {
        let filePath = process.env.PATH_FILES_NEWS + fileName;
        if (existsSync(filePath)) {
            return res.sendFile(fileName, {
                root: process.env.PATH_FILES_NEWS
            });
        }
        throw new NotFoundException();
    }
}
