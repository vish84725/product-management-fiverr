import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { AuthService } from '../utils/auth.service';

@Module({
  imports: [
		MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
	],
  providers: [UserService,AuthService],
  controllers: [UserController],
  exports: [UserService,MongooseModule]
})
export class UserModule {}
