import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BottleEntity } from './entities/bottle.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateBottleDto } from './dto/create-bottle.dto';
import { UpdateBottleDto } from './dto/update-bottle.dto';
import { existsSync, unlink } from 'fs';

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
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<BottleEntity[]> {
        return await this.bottleRepository.find({
            skip, take, order, where: {
                name: Like(`%${contains}%`)
            }
        });
    }

    async findAll(): Promise<BottleEntity[]> {
        return await this.bottleRepository.find();
    }

    async createBottle(bottle: CreateBottleDto, filesBottle?: { img_bottle?: Express.Multer.File[], pdf_bottle?: Express.Multer.File[] }): Promise<BottleEntity> {
        if (filesBottle && filesBottle.img_bottle && filesBottle.img_bottle.length) {
            bottle.img_original_name = filesBottle.img_bottle[0].originalname;
            bottle.img_name = filesBottle.img_bottle[0].filename;
        }
        if (filesBottle && filesBottle.pdf_bottle && filesBottle.pdf_bottle.length) {
            bottle.pdf_original_name = filesBottle.pdf_bottle[0].originalname;
            bottle.pdf_name = filesBottle.pdf_bottle[0].filename;
        }
        let newBottle = {
            ...bottle
        };
        return await this.bottleRepository.save(newBottle);
    }

    async updateBottle(
        id: string,
        bottle: UpdateBottleDto,
        filesBottle?: { img_bottle?: Express.Multer.File[], pdf_bottle?: Express.Multer.File[] }
    ): Promise<BottleEntity> {
        if (filesBottle && filesBottle.img_bottle && filesBottle.img_bottle.length) {
            // Delete old img
            if (bottle.img_name) {
                this.deleteFileBottle(bottle.img_name);
            }
            bottle.img_original_name = filesBottle.img_bottle[0].originalname;
            bottle.img_name = filesBottle.img_bottle[0].filename;
        }
        if (filesBottle && filesBottle.pdf_bottle && filesBottle.pdf_bottle.length) {
            // Delete old pdf
            if (bottle.pdf_name) {
                this.deleteFileBottle(bottle.pdf_name);
            }
            bottle.pdf_original_name = filesBottle.pdf_bottle[0].originalname;
            bottle.pdf_name = filesBottle.pdf_bottle[0].filename;
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
            this.deleteFileBottle(bottle.img_name);
        }
        return await this.bottleRepository.softDelete(id);
    }

    deleteFileBottle(fileName: string): void {
        let filePath = process.env.PATH_FILES_BOTTLE + fileName;
        if (existsSync(filePath)) {
            unlink(filePath, (err) => {
                if (err) throw err;
                console.log(filePath + ' was deleted');
            });
        }
    }

    async countBottles(): Promise<Number> {
        return await this.bottleRepository.count();
    }
}
