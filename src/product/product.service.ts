import { Injectable, HttpService } from '@nestjs/common';
import { ProductSearchDTO, ProductQuery } from './product.model';
import { Observable } from 'rxjs';
import { AxiosResponse } from "axios";
import { map } from 'rxjs/operators';
import { Constants } from '../utils/app.model';
import { AppConfigService } from '../utils/app-config-service';

let FOOD_SEARCH_API = ''

@Injectable()
export class ProductService {

    constructor(private httpService: HttpService,
                private appConfigService: AppConfigService) {
                    FOOD_SEARCH_API = `${appConfigService.FOOD_API}/v0/product/`;
                }

    public searchProduct(barcode:string):Promise<AxiosResponse<any>>  {
        return this.httpService.get(`${FOOD_SEARCH_API}${barcode}`).toPromise()
	}
}
