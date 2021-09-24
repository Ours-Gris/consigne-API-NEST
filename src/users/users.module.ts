import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { AddressEntity } from './entities/address.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forFeature([UserEntity, AddressEntity])
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})

export class UsersModule {
}
