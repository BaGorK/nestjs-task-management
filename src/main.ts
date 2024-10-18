import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'warn'],
  });
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server is running on on port: ${PORT}...`);
  });
}
bootstrap();
