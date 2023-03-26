import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      //filtering out properties that should not be received
      whitelist: true,
      forbidNonWhitelisted: true,
      //enabling autotransformation
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Shockbyte BirdHouse Server')
    .setDescription('An API for managing birdhouses and their residencies')
    .setVersion('1.0')
    .addTag('Shockbyte, birdhouses, residencies')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
