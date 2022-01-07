import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialEntity } from './entities/material.entity';
import { Like, Repository, UpdateResult } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { deleteFile } from '../utils/file-upload.utils';

@Injectable()
export class MaterialsService {

    constructor(
        @InjectRepository(MaterialEntity)
        private materialRepository: Repository<MaterialEntity>
    ) {
    }

    async findOneMaterialById(id: string): Promise<MaterialEntity> {
        return await this.materialRepository.findOne({ id });
    }

    async findMaterials(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<MaterialEntity[]> {
        return await this.materialRepository.find({
            skip, take, order, where: {
                name: Like(`%${contains}%`)
            }
        });
    }

    async findAll(): Promise<MaterialEntity[]> {
        return await this.materialRepository.find();
    }

    async createMaterial(material: CreateMaterialDto, imgMaterial?: Express.Multer.File): Promise<MaterialEntity> {
        let newMaterial = {
            ...material,
            price: material.price ? Number(material.price) : 0,
            img_original_name: imgMaterial ? imgMaterial.originalname : '',
            img_name: imgMaterial ? imgMaterial.filename : ''
        };
        return await this.materialRepository.save(newMaterial);
    }

    async updateMaterial(
        id: string,
        material: UpdateMaterialDto,
        fileMulter?: Express.Multer.File
    ): Promise<MaterialEntity> {
        if (fileMulter) {
            if (!fileMulter.filename) {
                throw new NotFoundException();
            }
            // Delete old img
            if (material.img_name) {
                deleteFile(process.env.PATH_FILES_MATERIAL, material.img_name);
            }
            material.img_original_name = fileMulter.originalname;
            material.img_name = fileMulter.filename;
        }
        // On récupére le material et on remplace les anciennes valeurs
        const targetMaterial = await this.materialRepository.preload({
            id,
            ...material,
            price: material.price ? Number(material.price) : 0,
        });
        // tester si le material avec cet id n'existe pas
        if (!targetMaterial) {
            throw new NotFoundException();
        }
        return await this.materialRepository.save(targetMaterial);
    }

    async deleteMaterial(id: string): Promise<UpdateResult> {
        let material = await this.materialRepository.findOne({ id });
        if (material.img_name) {
            deleteFile(process.env.PATH_FILES_MATERIAL, material.img_name);
        }
        return await this.materialRepository.softDelete(id);
    }

    async countMaterials(): Promise<Number> {
        return await this.materialRepository.count();
    }
}
