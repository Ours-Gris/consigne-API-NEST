import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './entities/news.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([NewsEntity]),
        MulterModule.register({ dest: process.env.PATH_FILES_NEWS })
    ],
    controllers: [NewsController],
    providers: [NewsService]
})
export class NewsModule {
}
