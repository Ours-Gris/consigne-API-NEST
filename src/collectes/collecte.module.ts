import { Module } from '@nestjs/common';
import { CollecteService } from './collecte.service';
import { CollecteController } from './collecte.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollecteEntity } from './entities/collecte.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([CollecteEntity])
    ],
    providers: [CollecteService],
    controllers: [CollecteController]
})
export class CollecteModule {
}
