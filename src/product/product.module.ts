import { Module, HttpModule } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthService } from '../utils/auth.service';
import { AppConfigService } from '../utils/app-config-service';

@Module({
  imports:[HttpModule],
  controllers: [ProductController],
  providers: [ProductService,AuthService,AppConfigService],
  exports: [ProductService]
})
export class ProductModule {}
