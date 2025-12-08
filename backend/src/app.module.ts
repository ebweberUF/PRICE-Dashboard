import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config';

// Import all entities
import {
  User,
  Lab,
  Study,
  StudyParticipant,
  ParticipantVisit,
  ParticipantDataStatus,
  LabUserAccess,
  StudyUserAccess,
  StudyDataSource,
  AuditLog,
} from './entities';

// Import modules
import { UsersModule } from './modules/users';
import { LabsModule } from './modules/labs';
import { StudiesModule } from './modules/studies';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Database module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          User,
          Lab,
          Study,
          StudyParticipant,
          ParticipantVisit,
          ParticipantDataStatus,
          LabUserAccess,
          StudyUserAccess,
          StudyDataSource,
          AuditLog,
        ],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
    }),

    // Feature modules
    UsersModule,
    LabsModule,
    StudiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
