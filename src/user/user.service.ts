import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../utils/auth.service';
import { UtilService } from '../utils/util.service';
import { UsersDTO, UserCreateDTO } from './user.model';

@Injectable()
export class UserService {
    constructor(
		@InjectModel('User') private readonly userModel: Model<any>,
		private authService: AuthService,
		private utilService: UtilService,
	) {

    }
    
    public async findUserByEmailOrMobile(email: string, mobileNumber: string): Promise<UsersDTO> {
		if (email) email = email.toLowerCase();
		const user = await this.userModel.findOne({ $or: [{ email: email }, { mobileNumber: mobileNumber }] });
		return user;
    }
    
    public async createUser(userData: UserCreateDTO): Promise<UsersDTO> {
		if (userData.email) userData.email = userData.email.toLowerCase();
		const { salt, hashedPassword } = await this.authService.hashPassword(userData.password);
		userData.salt = salt;
		userData.password = hashedPassword;

		const user = await this.userModel.create(userData);
		return user;
	}
}
