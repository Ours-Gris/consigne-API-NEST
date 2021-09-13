import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ) {
    }

    async findOneUserById(id: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ id });
    }

    async findOneUserByEmail(email: string): Promise<UserEntity> {
        return await this.userRepository.findOne({ email });
    }

    async findUsers(
        skip: number,
        take: number,
        order: any
    ): Promise<UserEntity[]> {
        return await this.userRepository.find({ skip, take, order});
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
        if (user.password) {
            user.password = await AuthService.hashPassword(user.password);
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
        return await this.userRepository.save(targetUser);
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async countUsers(): Promise<Number> {
        return await this.userRepository.count();
    }
}
