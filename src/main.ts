import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
	app.enableCors();

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
		next();
	});

  if (process.env.PREDIFINED && process.env.PREDIFINED == "true") {
		let options = new DocumentBuilder().setTitle('Products App').setBasePath("/").setVersion('v1').addBearerAuth().setSchemes('https', 'http').build();

		const document = SwaggerModule.createDocument(app, options, {
			include: [UserModule, ProductModule]
		});
		SwaggerModule.setup('/explorer', app, document);
  }
  
  await app.listen(3000);
}
bootstrap();
