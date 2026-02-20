import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Server running on port ${process.env.PORT ?? 3000}`);
  console.log(`🌐 CORS enabled for ${frontendUrl}`);
}

bootstrap().catch((err) => {
  console.error('❌ Application failed to start:', err);
  process.exit(1);
});
