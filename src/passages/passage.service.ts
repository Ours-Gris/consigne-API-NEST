import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassageEntity } from './entities/passage.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreatePassageDto } from './dto/create-passage.dto';
import { UpdatePassageDto } from './dto/update-passage.dto';

@Injectable()
export class PassageService {

    constructor(
        @InjectRepository(PassageEntity)
        private passageRepository: Repository<PassageEntity>
    ) {
    }

    async findOnePassageById(id: string): Promise<PassageEntity> {
        return await this.passageRepository.findOne({ id });
    }

    async findUserPassages(
        idUser: string,
        skip: number,
        take: number,
        order: any
    ): Promise<PassageEntity[]> {
        return await this.passageRepository.find({ skip, take, order, where: { user: idUser } });
    }

    async findPassages(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<PassageEntity[]> {
        return await this.passageRepository.find({ skip, take, order });
    }

    async findAll(): Promise<PassageEntity[]> {
        return await this.passageRepository.find();
    }

    async createPassage(passage: CreatePassageDto): Promise<PassageEntity> {
        return await this.passageRepository.save(passage);
    }

    async updatePassage(
        id: string,
        passage: UpdatePassageDto
    ): Promise<PassageEntity> {
        // On récupére le passage et on remplace les anciennes valeurs
        const targetPassage = await this.passageRepository.preload({
            id,
            ...passage
        });
        // tester si le passage avec cet id n'existe pas
        if (!targetPassage) {
            throw new NotFoundException();
        }
        return await this.passageRepository.save(targetPassage);
    }

    async deletePassage(id: string): Promise<UpdateResult> {
        return await this.passageRepository.softDelete(id);
    }

    async countPassages(): Promise<Number> {
        return await this.passageRepository.count();
    }

    async countUserPassages(idUser: string): Promise<Number> {
        return await this.passageRepository.count({
            where: { user: idUser }
        });
    }
}
