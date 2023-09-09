import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app/app.module";
import * as compression from "compression";
import helmet from "helmet";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { APP, SWAGGER_STATS } from "src/config";
import * as swaggerStats from "swagger-stats";
async function boostrap() {
  const logger = new Logger("Learn Nest");

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  //   app.use(compression);
  //   app.use(helmet);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const schema: SecuritySchemeObject = {
    description: "a jwt token containing emai and role",
    scheme: "bearer",
    bearerFormat: "JWT",
    type: "http",
  };

  const config = new DocumentBuilder()
    .setTitle("boook trips api")
    .setDescription("main api")
    .setVersion("1.0")
    .addBearerAuth(schema)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // app.enableCors({
  //   origin: '*',
  // });
  if (APP.NODE_ENV !== "production") {
    SwaggerModule.setup("api", app, document);
    logger.log(`Swagger api at http://localhost:${APP.PORT}/api`);
  }

  app.use(
    swaggerStats.getMiddleware({
      name: "learn nest api",
      version: "1.0.0",
      uriPath: "/stats",
      authentication: true,
      apdexThreshold: 30,
      swaggerSpec: document,
      sessionMaxAge: 86400,
      swaggerOnly: true,
      onAuthenticate(req, username, password) {
        return (
          username === SWAGGER_STATS.USERNAME &&
          password === SWAGGER_STATS.PASSWORD
        );
      },
    })
  );
  await app.listen(APP.PORT);
  logger.log(`Server is Connected at http://localhost:${APP.PORT}`);
  logger.log(`Swagger Api at http://localhost:${APP.PORT}/api`);
  logger.log(`Swagger Stats at http://localhost:${APP.PORT}/stats`);
  logger.verbose("Api is listening...version 1.0.0");
}

boostrap();
