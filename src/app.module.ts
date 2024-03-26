import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './modules/company/company.module';
import { StationModule } from './modules/station/station.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts, .js}'],
        synchronize: true
      }),
    }),
    CompanyModule,
    StationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
