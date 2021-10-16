import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CollecteEntity } from './entities/collecte.entity';
import { Not, Repository, UpdateResult } from 'typeorm';
import { CreateCollecteDto } from './dto/create-collecte.dto';
import { UpdateCollecteDto } from './dto/update-collecte.dto';
import { CollecteStatus } from '../enums/collecte.status';

@Injectable()
export class CollecteService {

    constructor(
        @InjectRepository(CollecteEntity)
        private collecteRepository: Repository<CollecteEntity>
    ) {
    }

    async findOneCollecteById(id: string): Promise<CollecteEntity> {
        return await this.collecteRepository.findOne({ id });
    }

    async findUserCollectes(
        idUser: string,
        skip: number,
        take: number,
        order: any
    ): Promise<CollecteEntity[]> {
        return await this.collecteRepository.find({ skip, take, order, where: { user: idUser } });
    }

    async findCollectes(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<CollecteEntity[]> {
        return await this.collecteRepository.find({ skip, take, order });
    }

    async findWaitingCollectes(
        skip: number,
        take: number,
        order: any
    ): Promise<CollecteEntity[]> {
        return await this.collecteRepository.find({
            skip, take, order, where: {
                status: Not(CollecteStatus.COLLECTED)
            }
        });
    }

    async findAll(): Promise<CollecteEntity[]> {
        return await this.collecteRepository.find();
    }

    async createCollecte(collecte: CreateCollecteDto): Promise<CollecteEntity> {
        return await this.collecteRepository.save(collecte);
    }

    async updateCollecte(
        id: string,
        collecte: UpdateCollecteDto
    ): Promise<CollecteEntity> {
        // On récupére le collecte et on remplace les anciennes valeurs
        const targetCollecte = await this.collecteRepository.preload({
            id,
            ...collecte
        });
        // tester si le collecte avec cet id n'existe pas
        if (!targetCollecte) {
            throw new NotFoundException();
        }
        return await this.collecteRepository.save(targetCollecte);
    }

    async deleteCollecte(id: string): Promise<UpdateResult> {
        return await this.collecteRepository.softDelete(id);
    }

    async countCollectes(): Promise<Number> {
        return await this.collecteRepository.count();
    }

    async countWaitingCollectes(): Promise<Number> {
        return await this.collecteRepository.count({
            where: { status: Not(CollecteStatus.COLLECTED) }
        });
    }

    async countUserCollectes(idUser: string): Promise<Number> {
        return await this.collecteRepository.count({
            where: { user: idUser }
        });
    }
}
