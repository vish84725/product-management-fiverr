import * as mongoose from 'mongoose';
import {
	Equals,
	IsArray,
	IsEmpty, IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Matches,
	ValidateNested,
	Length,
	IsBoolean
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export interface CommonResponseModel {
	response_code: number;
	response_data: any;
	extra?: string;
}

export class ResponseSuccessMessage {
	@IsString()
	@ApiModelProperty()
	response_code: string;

	@IsString()
	@ApiModelProperty()
	response_data: string;
}

export class ResponseBadRequestMessage {
	@IsNumber()
	@ApiModelProperty()
	status: number;

	@ApiModelProperty()
	errors: Array<string>;

}
export class ResponseErrorMessage {
	@IsNumber()
	@ApiModelProperty()
	status: number;

	@IsString()
	@ApiModelProperty()
	message: string;
}

export enum ResponseMessage {
    REQUIRED_VALID_MOBILE_NUMBER = 'REQUIRED_VALID_MOBILE_NUMBER',
	USER_EMAIL_ALREADY_EXIST = 'USER_EMAIL_ALREADY_EXIST',
	USER_EMAIL_DOESNT_EXIST = 'USER_DOESNT_EXIST',
    USER_MOBILE_ALREADY_EXIST = 'USER_MOBILE_ALREADY_EXIST',
    USER_REGISTERED = 'USER_REGISTERED_SUCCESSFULLY',
    SOMETHING_WENT_WRONG = 'SOMETHING_WENT_WRONG',
    USER_EMAIL_NOT_FOUND = 'USER_EMAIL_NOT_FOUND',
    USER_ACCOUNT_BLOCKED = 'USER_ACCOUNT_BLOCKED',
    USER_EMAIL_OR_PASSWORD_INVALID = 'USER_EMAIL_OR_PASSWORD_INVALID',
	REQUIRED_BARCODE = 'REQUIRED_BARCODE',
	USER_UPDATED_SUCCESSFULLY = 'USER_UPDATED_SUCCESSFULLY'
}

export class Constants {
    public FOODAPI = process.env.FOOD_API
}