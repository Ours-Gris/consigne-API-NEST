import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DeleteResult, Like, Repository, In } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { AddressEntity } from './entities/address.entity';
import { UserRole } from '../enums/user.role';
import { CollecteStatus } from '../enums/collecte.status';
import { deleteFile } from '../utils/file-upload.utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(AddressEntity)
        private addressRepository: Repository<AddressEntity>
    ) {
    }

    async findMe(id: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ id }, { relations: ['address', 'delivery_address'] });
    }

    // ToDo voir les valeur à retourner
    async findUserPublic(id: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ id }, {
            relations: ['address', 'delivery_address']
            // select: []
        });
    }

    async findOneUserById(id: string): Promise<UserEntity> {
        return await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.address', 'address')
            .leftJoinAndSelect('user.delivery_address', 'delivery_address')
            .addSelect('user.internal_data')
            .where('user.id = :id', { id })
            .getOne();
    }

    async findOneUserByEmail(email: string): Promise<UserEntity> {
        return await this.userRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email })
            .getOne();
    }

    async findUsers(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<UserEntity[]> {
        return await this.userRepository.find({
            skip, take, order,
            relations: ['address', 'delivery_address'],
            where: {
                username: Like(`%${contains}%`)
            }
        });
    }

    async findUsersCompany(
        contains: string,
        skip: number,
        take: number,
        order: any,
        where: Partial<UserEntity>
    ): Promise<UserEntity[]> {
        return await this.userRepository.find({
            skip, take, order,
            where: {
                company: Like(`%${contains}%`),
                ...where
            },
            select: ['id', 'username', 'company', 'description', 'img_name']
        });
    }

    async findUsersWaitingPassage(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<UserEntity[]> {
        return await this.userRepository.find({
            skip, take, order,
            relations: ['address', 'delivery_address'],
            where: {
                collecte_point: true,
                collecte_status: In([CollecteStatus.FULL, CollecteStatus.ALMOST_FULL]),
                username: Like(`%${contains}%`)
            }
        });
    }

    async findAllForExport(): Promise<UserEntity[]> {
        return await this.userRepository.find({
            where: { role: UserRole.USER },
            relations: ['address', 'delivery_address']
        });
    }

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        if (user.address) {
            await this.addressRepository.save(user.address);
        }
        if (user.delivery_address) {
            await this.addressRepository.save(user.delivery_address);
        }
        return this.userRepository.save(user);
    }

    async updateUser(
        id: string,
        user: UpdateUserDto,
        fileMulter?: Express.Multer.File
    ): Promise<UserEntity> {
        if (fileMulter) {
            if (!fileMulter.filename) {
                throw new BadRequestException('Probléme pour enregistrer l\'image');
            }
            // Delete old img
            if (user.img_name) {
                deleteFile(process.env.PATH_FILES_LOGO, user.img_name);
            }
            user.img_original_name = fileMulter.originalname;
            user.img_name = fileMulter.filename;
        }
        // On récupére le user et on remplace les anciennes valeurs
        const targetUser = await this.userRepository.preload({
            id,
            ...user
        });
        // tester si le user avec cet id n'existe pas
        if (!targetUser) {
            throw new NotFoundException();
        }
        if (user.password) {
            targetUser.password = await AuthService.hashPassword(user.password);
        }
        if (targetUser.address) {
            await this.addressRepository.save(targetUser.address);
        }
        if (targetUser.delivery_address) {
            await this.addressRepository.save(targetUser.delivery_address);
        }
        return await this.userRepository.save(targetUser);
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async countUsers(): Promise<Number> {
        return await this.userRepository.count();
    }

    async countUsersCustom(where: Partial<UserEntity>): Promise<Number> {
        return await this.userRepository.count({ where });
    }

    async countUsersWaiting(): Promise<Number> {
        return await this.userRepository.count({
            where: {
                collecte_point: true,
                collecte_status: In([CollecteStatus.FULL, CollecteStatus.ALMOST_FULL])
            }
        });
    }
}
