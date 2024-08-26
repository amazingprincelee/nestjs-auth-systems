import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global CORS Configuration
   * 
   * This configuration allows all origins to access the API. 
   * Adjust the `origin` parameter to restrict access to specific origins.
   * Methods and headers are also configured to allow common HTTP operations.
   */
  app.enableCors({
    origin: '*', // Change this to your frontend URL in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  /**
   * Global Validation Pipe
   * 
   * This validation pipe ensures that all incoming requests are validated
   * based on the defined DTOs. It automatically strips out any properties
   * that are not part of the DTO (whitelist) and prevents non-whitelisted 
   * properties from being accepted.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Automatically transforms payloads to DTO instances
    }),
  );

  /**
   * Swagger Documentation Configuration
   * 
   * This section sets up the Swagger documentation for your API.
   * Swagger provides a user-friendly UI to explore your API endpoints and 
   * see how they work. It also allows developers to interact with the API 
   * directly from the documentation.
   * 
   * The project uses PostgreSQL as its database with TypeORM for the ORM.
   * The base URL for the API is configured to `http://localhost:3000`.
   * 
   * You can access the Swagger UI at `http://localhost:3000/rongon-project`.
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Node.js Backend API with User Authentication')
    .setDescription(`
      This API provides user authentication and social login features.
      It is built with NestJS, using PostgreSQL as the database and TypeORM as the ORM.
      Use the base API URL as http://localhost:3000. 
      Ensure to set up your environment variables correctly for database connection and JWT secrets.
      Test google authentication on browser, swagger will return cor issues.
      It app also have websocket installed with a preliminary chating system.
    `)
    .addServer('http://localhost:3000/')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT Bearer authentication support in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('rongon-project', app, document);

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
