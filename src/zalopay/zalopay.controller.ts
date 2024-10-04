import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { ZalopayService } from './zalopay.service';


@Controller('zalopay')
export class ZalopayController {
  constructor(private readonly zalopayService: ZalopayService) {}

  @Get()
  zaloPayGateway() {
   return this.zalopayService.createZaloPayPayment();
  }

  @Get('/callback')
  callback(@Req() req) {
    return this.zalopayService.callBackZaloPay(req);
  }
}
