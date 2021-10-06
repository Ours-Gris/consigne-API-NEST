import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialController } from './material.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from './entities/material.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([MaterialEntity])
    ],
    providers: [MaterialsService],
    controllers: [MaterialController]
})
export class MaterialModule {
}
