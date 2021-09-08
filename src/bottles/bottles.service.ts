import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BottleEntity } from './entities/bottle.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateBottleDto } from './dto/create-bottle.dto';
import { UpdateBottleDto } from './dto/update-bottle.dto';
import { unlink } from 'fs';

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
        return await this.bottleRepository.find({ skip, take, order });
    }

    async createBottle(bottle: CreateBottleDto, imgBottle?: Express.Multer.File): Promise<BottleEntity> {
        let newBottle = {
            ...bottle,
            img_original_name: imgBottle.originalname,
            img_name: imgBottle.filename
        };

        return await this.bottleRepository.save(newBottle);
    }

    async updateBottle(id: string, bottle: UpdateBottleDto, imgBottle?: Express.Multer.File): Promise<BottleEntity> {
        if (imgBottle) {
            // Delete old img
            if (bottle.img_name) {
                this.deleteImgBottle(bottle.img_name)
            }
            bottle.img_original_name = imgBottle.originalname;
            bottle.img_name = imgBottle.filename;
        }
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
        let bottle = await this.bottleRepository.findOne({ id });
        if (bottle.img_name) {
            this.deleteImgBottle(bottle.img_name)
        }
        return await this.bottleRepository.softDelete(id);
    }

    deleteImgBottle(img_name: string): void {
        unlink('./uploads/bottle/' + img_name, (err) => {
            if (err) throw err;
            console.log('./uploads/bottle/' + img_name + ' was deleted');
        });
    }

    // async restoreBottle(id: string): Promise<UpdateResult> {
    //     return await this.bottleRepository.restore(id);
    // }

    async countBottles(): Promise<Number> {
        return await this.bottleRepository.count();
    }
}
