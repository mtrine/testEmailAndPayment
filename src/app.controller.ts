import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('banks')
  async getBankList() {
    return this.appService.getBankList();
  }


  @Get('payment')
  async buildPaymentUrl(@Req() req) {
    return this.appService.buildPaymentUrl(req);
  }

  @Get('vnpay-return')
  async handleVnpayReturn(@Req() req) {
    return this.appService.handleVnpayReturn(req);
  }
}
