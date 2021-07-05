import { Controller, Post, Body } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthService } from '../utils/auth.service';
import { UtilService } from '../utils/util.service';
import { UserCreateDTO } from './user.model';
import { ResponseSuccessMessage, ResponseBadRequestMessage, ResponseErrorMessage, CommonResponseModel, ResponseMessage } from '../utils/app.model';

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
        this.utilService.errorResponse(e);
    }
}

}
