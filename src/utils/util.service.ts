import { Injectable, BadRequestException, HttpStatus, NotFoundException, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class UtilService {
    constructor() {
    }
    
    public convertToNumber(input: string): number {
		var number = Number(input);
		if (!isNaN(number)) {
			return number;
		} else return 0;
    }
    
    public badRequest(msg?) {
		throw new BadRequestException(msg);
    }
    
    public async successResponseMsg(msg) {
		return await this.res(HttpStatus.OK, msg);
    }
    
    private async res(responseCode, responseData?) {
		let message = "";
		if (responseData) {
			message = responseData;
        }
        
		return {
			response_code: responseCode,
			response_data: message
		}
    }
    
    public errorResponse(e) {
		console.log(e);
		if (e.kind === 'ObjectId' && e.path === '_id') {
			throw new NotFoundException("NOT_FOUND")
		}
		if (e.message && e.message.statusCode == HttpStatus.BAD_REQUEST) {
			throw new BadRequestException(e.message);
		}
		if (e.message && e.message.statusCode == HttpStatus.NOT_FOUND) {
			throw new NotFoundException(e.message.message);
		}
		// if(e.kind === 'ObjectId' && e.path === '_id') {
		//     throw new NotFoundException('NOT_FOUND');
		// } else
		//     throw new NotFoundException("NOT_FOUND")
		//   throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		//return await this.res(HttpStatus.INTERNAL_SERVER_ERROR, "", key);
		//console.log(e.kind);
    }
    
    public async successResponseData(responseData, extra?) {
		if (!extra) return await this.res(HttpStatus.OK, responseData);
		let res = await this.res(HttpStatus.OK, responseData);
		for (var key in extra) res[key] = extra[key];
		return res;
    }
    
    public unauthorized() {
		const msg = 'UNAUTHORIZED';
		throw new UnauthorizedException(msg);
    }
}