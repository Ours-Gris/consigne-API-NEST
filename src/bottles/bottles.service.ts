import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BottleEntity } from './entities/bottle.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateBottleDto } from './dto/create-bottle.dto';
import { UpdateBottleDto } from './dto/update-bottle.dto';

@Injectable()
export class BottlesService {

    constructor(
        @InjectRepository(BottleEntity)
        private bottleRepository: Repository<BottleEntity>
    ) {
    }

    async findOneBottleById(id: string): Promise<BottleEntity> {
        return await this.bottleRepository.findOne({ id });
    }

    async findBottles(
        skip: number,
        take: number,
        order: any
    ): Promise<BottleEntity[]> {
        return await this.bottleRepository.find({ skip, take, order});
    }

    async createBottle(bottle: CreateBottleDto): Promise<BottleEntity> {
        return await this.bottleRepository.save(bottle);
    }

    // Il est possible de faire une update de masse avec une autre methode
    async updateBottle(id: string, bottle: UpdateBottleDto): Promise<BottleEntity> {
        // On récupére le bottle et on remplace les anciennes valeurs
        const targetBottle = await this.bottleRepository.preload({
            id,
            ...bottle
        });
        // tester si le bottle avec cet id n'existe pas
        if (!targetBottle) {
            throw new NotFoundException();
        }
        return await this.bottleRepository.save(targetBottle);
    }

    async deleteBottle(id: string): Promise<UpdateResult> {
        return await this.bottleRepository.softDelete(id);
    }

    async restoreBottle(id: string): Promise<UpdateResult> {
        return await this.bottleRepository.restore(id);
    }

    async countBottles(): Promise<Number> {
        return await this.bottleRepository.count();
    }
}
