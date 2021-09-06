import { Module } from '@nestjs/common';
import { BottlesController } from './bottles.controller';
import { BottlesService } from './bottles.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BottleEntity } from './entities/bottle.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([BottleEntity])
    ],
    controllers: [BottlesController],
    providers: [BottlesService]
})
export class BottlesModule {
}
