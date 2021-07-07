import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../utils/auth.service';
import { UtilService } from '../utils/util.service';
import { UsersDTO, UserCreateDTO, UserUpdateDTO } from './user.model';

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
	
	public async findUserByEmail(email: string): Promise<UsersDTO> {
		if (email) email = email.toLowerCase();
		const user = await this.userModel.findOne({email: email} );
		return user;
	}
	
	public async findUserByMobile(id:string,mobileNumber: string): Promise<UsersDTO> {
		const user = await this.userModel.findOne(
			{
				$and:[
					{ _id: { $ne: id } },
					{ mobileNumber:mobileNumber }
				]
			}
		);
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
    
    public async getUserByEmail(email: String): Promise<UsersDTO> {
		const user = await this.userModel.findOne({ email: email });
		return user;
    }
    
    public async getUserById(userId: String): Promise<UsersDTO> {
		const user = await this.userModel.findById(userId);
		return user;
	}

	public async updateUser(userId: string, userData: UserUpdateDTO): Promise<any> {
		const user = await this.userModel.findByIdAndUpdate(userId, { mobileNumber: userData.mobileNumber, firstName : userData.firstName, lastName: userData.lastName });
		return user;
	}
}
