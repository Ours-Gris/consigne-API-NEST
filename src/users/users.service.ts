import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
    }

    async findOneUserById(id): Promise<UserEntity> {
        return await this.userRepository.findOne({ id: id });
    }

    async findOneUserByIdentifier(identifier): Promise<UserEntity> {
        return await this.userRepository.createQueryBuilder('user')
            .where('user.username = :identifier or user.email = :identifier', { identifier })
            .getOne();
    }

    async findUsers(skip: number, take: number): Promise<UserEntity[]> {
        return await this.userRepository.find({ skip, take });
    }

    async findAllUsers(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async createUserWithHash(user: CreateUserDto): Promise<UserEntity> {
        const pass = await AuthService.hashPassword(user.password);
        return this.userRepository.save({ ...user, password: pass });
    }

    // For signUp in authService
    async createUser(user: CreateUserDto): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }

    // Il est possible de faire une update de masse avec une autre methode
    async updateUser(id: string, user: UpdateUserDto): Promise<UserEntity> {
        // On récupére le user et on remplace les anciennes valeurs
        const targetUser = await this.userRepository.preload({
            id,
            ...user
        });
        // tester si le user avec cet id n'existe pas
        if (!targetUser) {
            throw new NotFoundException();
        }
        return await this.userRepository.save(targetUser);
    }

    async deleteUser(id: string): Promise<UpdateResult> {
        return await this.userRepository.softDelete(id);
    }

    async restoreUser(id: string): Promise<UpdateResult> {
        return await this.userRepository.restore(id);
    }

    async countUsers(): Promise<Number> {
        return await this.userRepository.count();
    }

    // Pour des requetes spécifiques
    // async queryBuider() {
    //     const qb = this.userRepository.createQueryBuilder();
    //     return await qb.select()
    // }
}
