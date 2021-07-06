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
import { Prop } from '@nestjs/mongoose';

export class ProductQuery {
	barcode: string;
}

export class ProductSearchDTO{
    @Prop({type: mongoose.Schema.Types.Mixed})
    extra_options: any;
}