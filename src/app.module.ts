import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { BottlesModule } from './bottles/bottles.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: 'mariadb',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: ['dist/**/*.entity{.ts,.js}'],
            // TODO ATTENTION passer à false en prod
            synchronize: true
        }),
        // MailerModule.forRoot({
        //     // TODO a configurer
        //     transport: process.env.MAILER_TRANSPORT,
        //     defaults: {
        //         from: process.env.MAILER_FROM
        //     },
        //     template: {
        //         dir: __dirname + '/templates',
        //         adapter: new PugAdapter(),
        //         options: {
        //             strict: true
        //         }
        //     }
        // }),
        AuthModule,
        BottlesModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(HelmetMiddleware);
    }
}
