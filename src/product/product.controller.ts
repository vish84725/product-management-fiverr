import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { AuthService } from '../utils/auth.service';
import { UtilService } from '../utils/util.service';
import { ResponseBadRequestMessage, ResponseErrorMessage, ResponseMessage } from '../utils/app.model';
import { OptionalJwtAuthGuard, GetUser } from '../utils/jwt.strategy';
import { UsersDTO } from '../user/user.model';
import { ProductQuery } from './product.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
@ApiUseTags('Product')
export class ProductController {
    constructor(
        private productService: ProductService,
        private authService: AuthService,
        private utilService: UtilService,
      ){}

      @Get('/search')
      @ApiOperation({ title: 'Search product by product barcode' })
      @ApiResponse({ status: 200, description: 'Return details of product' })
      @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
      @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
      @UseGuards(AuthGuard('jwt'))
      @ApiBearerAuth()
      public async searchProduct(@GetUser() user: UsersDTO,@Query() productQuery: ProductQuery) {
          try {
              if(!productQuery.barcode){
                this.utilService.badRequest(ResponseMessage.REQUIRED_BARCODE);
              }
              let product = await this.productService.searchProduct(productQuery.barcode);
              return this.utilService.successResponseData(product.data);

          } catch (e) {
              throw e;
              //this.utilService.errorResponse(e);
          }
      }
}
