import * as mongoose from 'mongoose';
import {
	IsNotEmpty,
	IsEmail,
	IsEmpty,
	IsUrl,
	IsNumber,
	Length,
	IsOptional,
	IsPositive,
	Min,
	Equals,
	IsArray,
	ValidateNested,
	IsString,
	Max,
	IsEnum,
	IsAlphanumeric,
	IsBoolean,
} from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export const UserSchema = new mongoose.Schema({
	firstName: { type: String },
	lastName: { type: String },
	email: { type: String, trim: true, lowercase: true, sparse: true },
	password: { type: String },
	salt: { type: String },
	mobileNumber: { type: String, unique: true },
	status: { type: Boolean, default: true },
}, {
	timestamps: true
});

export class UsersDTO {

	@IsEmpty()
	_id: string;

	@IsString()
	@IsOptional()
	@ApiModelProperty()
	firstName: string;

	@IsString()
	@IsOptional()
	@ApiModelProperty()
	lastName: string;

	@IsString()
	@IsOptional()
	@ApiModelProperty()
	email: string;

	@IsString()
	@IsNotEmpty()
	@Length(5, 35)
	@ApiModelProperty()
	password: string;

	@IsString()
	@IsNotEmpty()
	@ApiModelProperty()
	mobileNumber: string;

	@IsString()
	@IsEmpty()
	salt: string;

	status: boolean

}


export class UserCreateDTO {
	@IsString()
	@ApiModelProperty()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@ApiModelProperty()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@ApiModelProperty()
	@IsNotEmpty()
	email: string;

	@IsString()
	@ApiModelProperty()
	@IsNotEmpty()
	@Length(6, 35)
	password: string;

	@IsString()
	@ApiModelProperty()
	mobileNumber: string;

	salt: string;
}

export class UserUpdateDTO {
	@IsString()
	@ApiModelProperty()
	@IsNotEmpty()
	email: string;
	
	@IsString()
	@ApiModelProperty()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@ApiModelProperty()
	@IsNotEmpty()
	lastName: string;

	@IsString()
	@ApiModelProperty()
	mobileNumber: string;

	salt: string;
}

export class LoginDTO {
	@ApiModelProperty()
	@IsNotEmpty()
	@IsEmail()
	@IsString()
	email: string;

	@ApiModelProperty()
	@IsNotEmpty()
	@Length(6, 35)
	@IsString()
	password: string;

}

export class LoginResponseDTO {
	@ApiModelProperty()
	token: string;

	@ApiModelProperty()
	id: string;
}

export class ResponseLogin {
	@IsString()
	@ApiModelProperty()
	response_code: string;

	@ApiModelProperty()
	response_data: LoginResponseDTO;
}
















