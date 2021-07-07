import { Controller, Post, Body, Put, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthService } from '../utils/auth.service';
import { UtilService } from '../utils/util.service';
import { UserCreateDTO, ResponseLogin, LoginDTO, UserUpdateDTO, UsersDTO } from './user.model';
import { ResponseSuccessMessage, ResponseBadRequestMessage, ResponseErrorMessage, CommonResponseModel, ResponseMessage } from '../utils/app.model';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../utils/jwt.strategy';

@Controller('users')
@ApiUseTags('Users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private utilService: UtilService,
  ) {}
/* ################################################### NO AUTH ################################## */
@Post('/register')
@ApiOperation({ title: 'Register user' })
@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
public async registerNewUser(@Body() userData: UserCreateDTO): Promise<CommonResponseModel> {
    try {
      
        const mobileNumber = this.utilService.convertToNumber(userData.mobileNumber);

        if (mobileNumber == 0) this.utilService.badRequest(ResponseMessage.REQUIRED_VALID_MOBILE_NUMBER);

        const checkUser = await this.userService.findUserByEmailOrMobile(userData.email, userData.mobileNumber);
        if (checkUser && checkUser.email == userData.email) this.utilService.badRequest(ResponseMessage.USER_EMAIL_ALREADY_EXIST);
        if (checkUser && checkUser.mobileNumber == userData.mobileNumber) this.utilService.badRequest(ResponseMessage.USER_MOBILE_ALREADY_EXIST);

        const user = await this.userService.createUser(userData);

        if (user) {
            return this.utilService.successResponseMsg(ResponseMessage.USER_REGISTERED);
        }
        else this.utilService.badRequest(ResponseMessage.SOMETHING_WENT_WRONG);
    } catch (e) {
        throw e;
        //this.utilService.errorResponse(e);
    }
}

@Put('')
@ApiOperation({ title: 'Update user' })
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
public async updateUser(@GetUser() loginUser: UsersDTO,@Body() userData: UserUpdateDTO): Promise<CommonResponseModel> {
    try {
        const mobileNumber = this.utilService.convertToNumber(userData.mobileNumber);

        if (mobileNumber == 0) this.utilService.badRequest(ResponseMessage.REQUIRED_VALID_MOBILE_NUMBER);

        const checkUser = await this.userService.findUserByEmail(userData.email);

        if(checkUser){
            const isMobileAlreadyHasUser = await this.userService.findUserByMobile(checkUser._id,userData.mobileNumber);
            console.log('u',isMobileAlreadyHasUser);
            if(isMobileAlreadyHasUser){
                this.utilService.badRequest(ResponseMessage.USER_MOBILE_ALREADY_EXIST);
            }
            const updatedData = await this.userService.updateUser(checkUser._id,userData);
			if (updatedData){
                return this.utilService.successResponseMsg(ResponseMessage.USER_UPDATED_SUCCESSFULLY);
            }else{
                this.utilService.badRequest(ResponseMessage.SOMETHING_WENT_WRONG);
            } 

        }else{
            this.utilService.badRequest(ResponseMessage.USER_EMAIL_DOESNT_EXIST)
        }     
    } catch (e) {
        throw e;
        //this.utilService.errorResponse(e);
    }
}

@Post('/login')
	@ApiOperation({ title: 'Log in user' })
	@ApiResponse({ status: 200, description: 'Return user info', type: ResponseLogin })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	public async validateUser(@Body() credential: LoginDTO): Promise<CommonResponseModel> {
		try {
			const user = await this.userService.getUserByEmail(credential.email);
			if (!user) this.utilService.badRequest(ResponseMessage.USER_EMAIL_NOT_FOUND);

			if (!user.status) this.utilService.badRequest(ResponseMessage.USER_ACCOUNT_BLOCKED);

			const isValid = await this.authService.verifyPassword(credential.password, user.password);
			if (!isValid) this.utilService.badRequest(ResponseMessage.USER_EMAIL_OR_PASSWORD_INVALID);

			const token = await this.authService.generateAccessToken(user._id);
			return this.utilService.successResponseData({ token: token, id: user._id});
		} catch (e) {
            throw e;
			//this.utilService.errorResponse(e);
		}
	}

}
