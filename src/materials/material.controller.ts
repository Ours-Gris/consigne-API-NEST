import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get, NotFoundException, Param,
    ParseIntPipe,
    Post, Put,
    Query, Res, UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { MaterialEntity } from './entities/material.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../utils/file-upload.utils';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { UpdateResult } from 'typeorm';
import { existsSync } from 'fs';

@Controller('materials')
export class MaterialController {

    constructor(
        private readonly materialsService: MaterialsService
    ) {
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findMaterials(
        @Query('name_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('name')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<MaterialEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.materialsService.findMaterials(contains, start, limit, order);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('export')
    async findAll(): Promise<MaterialEntity[]> {
        return await this.materialsService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('count')
    async countMaterials(): Promise<Number> {
        return await this.materialsService.countMaterials();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    @UseInterceptors(
        FileInterceptor(
            'img_material',
            {
                fileFilter: fileFilter
            }))
    async createMaterial(
        @Body() newMaterial: CreateMaterialDto,
        @UploadedFile() imgMaterial: Express.Multer.File
    ): Promise<MaterialEntity> {
        return await this.materialsService.createMaterial(newMaterial, imgMaterial);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    @UseInterceptors(
        FileInterceptor(
            'img_material',
            {
                fileFilter: fileFilter
            }))
    async updateMaterial(
        @Param('id') id: string,
        @Body() bottle: UpdateMaterialDto,
        @UploadedFile() fileMaterial: Express.Multer.File
    ): Promise<MaterialEntity> {
        return await this.materialsService.updateMaterial(id, bottle, fileMaterial);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteMaterial(@Param('id') id: string): Promise<UpdateResult> {
        return await this.materialsService.deleteMaterial(id);
    }

    @Get('file/:filePath')
    seeUploadedFile(@Param('filePath') fileName, @Res() res) {
        let filePath = process.env.PATH_FILES_MATERIAL + fileName;
        if (existsSync(filePath)) {
            return res.sendFile(fileName, {
                root: process.env.PATH_FILES_MATERIAL
            });
        }
        throw new NotFoundException();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneMaterial(@Param('id') id: string): Promise<MaterialEntity> {
        return await this.materialsService.findOneMaterialById(id);
    }
}
