import {
    Body,
    Controller,
    DefaultValuePipe, Delete,
    Get, Param,
    ParseIntPipe,
    Post, Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user.role';
import { DeleteResult } from 'typeorm';
import { FaqService } from './faq.service';
import { QuestionEntity } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('faq')
export class FaqController {

    constructor(
        private readonly faqService: FaqService
    ) {
    }

    @Get()
    async findQuestions(
        @Query('name_contains', new DefaultValuePipe('')) contains,
        @Query('_sort', new DefaultValuePipe('name')) sortBy,
        @Query('_direction', new DefaultValuePipe('ASC')) sortDirection,
        @Query('_start', new DefaultValuePipe(0), ParseIntPipe) start,
        @Query('_limit', new DefaultValuePipe(3), ParseIntPipe) limit
    ): Promise<QuestionEntity[]> {
        const order = {
            [sortBy]: sortDirection.toUpperCase()
        };
        return await this.faqService.findQuestions(contains, start, limit, order);
    }

    @Get('count')
    async countQuestions(): Promise<Number> {
        return await this.faqService.countQuestions();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOneQuestion(@Param('id') id: string): Promise<QuestionEntity> {
        return await this.faqService.findOneQuestionById(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async createQuestion(
        @Body() newQuestion: CreateQuestionDto
    ): Promise<QuestionEntity> {
        return await this.faqService.createQuestion(newQuestion);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Put(':id')
    async updateQuestion(
        @Param('id') id: string,
        @Body() bottle: UpdateQuestionDto
    ): Promise<QuestionEntity> {
        return await this.faqService.updateQuestion(id, bottle);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async deleteQuestion(@Param('id') id: string): Promise<DeleteResult> {
        return await this.faqService.deleteQuestion(id);
    }
}
