import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { QuestionEntity } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>
    ) {
    }

    async findOneQuestionById(id: string): Promise<QuestionEntity> {
        return await this.questionRepository.findOne({ id });
    }

    async findQuestions(
        contains: string,
        skip: number,
        take: number,
        order: any
    ): Promise<QuestionEntity[]> {
        return await this.questionRepository.find({
            skip, take, order, where: {
                label: Like(`%${contains}%`)
            }
        });
    }

    async createQuestion(question: CreateQuestionDto): Promise<QuestionEntity> {
        let newQuestion = { ...question };
        return await this.questionRepository.save(newQuestion);
    }

    async updateQuestion(
        id: string,
        question: UpdateQuestionDto
    ): Promise<QuestionEntity> {
        // On récupére le question et on remplace les anciennes valeurs
        const targetQuestion = await this.questionRepository.preload({
            id,
            ...question
        });
        // tester si le question avec cet id n'existe pas
        if (!targetQuestion) {
            throw new NotFoundException();
        }
        return await this.questionRepository.save(targetQuestion);
    }

    async deleteQuestion(id: string): Promise<DeleteResult> {
        return await this.questionRepository.delete(id);
    }

    async countQuestions(): Promise<Number> {
        return await this.questionRepository.count();
    }
}
