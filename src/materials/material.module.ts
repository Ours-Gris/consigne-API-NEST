import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialController } from './material.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from './entities/material.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([MaterialEntity]),
        MulterModule.register({ dest: process.env.PATH_FILES_MATERIAL })
    ],
    providers: [MaterialsService],
    controllers: [MaterialController]
})
export class MaterialModule {
}
