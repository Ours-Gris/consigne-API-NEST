import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { deleteFile } from '../utils/file-upload.utils';
import { NewsEntity } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
    constructor(
        @InjectRepository(NewsEntity)
        private newsRepository: Repository<NewsEntity>
    ) {
    }

    async findOneNewsById(id: string): Promise<NewsEntity> {
        return await this.newsRepository.findOne({ id });
    }

    async findNews(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<NewsEntity[]> {
        return await this.newsRepository.find({
            skip, take, order, where: {
                title: Like(`%${contains}%`)
            }
        });
    }

    async createNews(news: CreateNewsDto, imgNews?: Express.Multer.File): Promise<NewsEntity> {
        let newNews = {
            ...news,
            img_original_name: imgNews ? imgNews.originalname : '',
            img_name: imgNews ? imgNews.filename : ''
        };
        return await this.newsRepository.save(newNews);
    }

    async updateNews(
        id: string,
        news: UpdateNewsDto,
        fileMulter?: Express.Multer.File
    ): Promise<NewsEntity> {
        if (fileMulter) {
            if (!fileMulter.filename) {
                throw new NotFoundException();
            }
            // Delete old img
            if (news.img_name) {
                deleteFile(process.env.PATH_FILES_MATERIAL, news.img_name);
            }
            news.img_original_name = fileMulter.originalname;
            news.img_name = fileMulter.filename;
        }
        // On récupére le news et on remplace les anciennes valeurs
        const targetNews = await this.newsRepository.preload({
            id,
            ...news
        });
        // tester si le news avec cet id n'existe pas
        if (!targetNews) {
            throw new NotFoundException();
        }
        return await this.newsRepository.save(targetNews);
    }

    async deleteNews(id: string): Promise<DeleteResult> {
        let news = await this.newsRepository.findOne({ id });
        if (news.img_name) {
            deleteFile(process.env.PATH_FILES_MATERIAL, news.img_name);
        }
        return await this.newsRepository.delete(id);
    }

    async countNews(): Promise<Number> {
        return await this.newsRepository.count();
    }
}
