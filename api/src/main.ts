import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001', // frontend origin
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  await app.listen(3000);
}
bootstrap();
