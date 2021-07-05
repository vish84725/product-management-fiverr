import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { UtilService } from './utils/util.service';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule.register({ secret: process.env.SECRET, signOptions: { expiresIn: '3h' } }),
    UserModule,],
  controllers: [AppController],
  providers: [
    AppService,
    UtilService],
  exports : [
    MongooseModule,
    UserModule,
    JwtModule,
    UtilService]
})
export class AppModule {}
