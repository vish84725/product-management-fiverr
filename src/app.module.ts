import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { UtilService } from './utils/util.service';
import { JwtModule } from '@nestjs/jwt';
import { ProductModule } from './product/product.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './utils/jwt.strategy';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestInterceptor } from './request.interceptor';
import { AllExceptionsFilter } from './exceptions.filter';
dotenv.config();

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
    useFactory: () => ({
      uri: (process.env.NODE_ENV == 'production') ? process.env.MONGO_DB_URL_PRODUCTION : process.env.MONGO_DB_URL_STAGING,
      useNewUrlParser: true, 
      useFindAndModify: false, 
      useUnifiedTopology: true
    }),
  }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.SECRET, signOptions: { expiresIn: '3h' } }),
    UserModule,
    ProductModule,],
  controllers: [AppController],
  providers: [
    AppService,
    UtilService,
    JwtStrategy,
		{
			provide: APP_INTERCEPTOR,
			useClass: RequestInterceptor
		},
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		}
  ],
  exports : [
    MongooseModule,
    UserModule,
    JwtModule,
    PassportModule,
    JwtStrategy,
    UtilService
  ]
})
export class AppModule {}
