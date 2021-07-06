
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppConfigService {
  constructor() {}

  get FOOD_API(): string {
    return process.env.FOOD_API
  }
}