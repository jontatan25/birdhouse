import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
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
  await app.listen(3000);
}
bootstrap();
