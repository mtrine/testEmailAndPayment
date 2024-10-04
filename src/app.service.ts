import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { VnpayService } from 'nestjs-vnpay';
import { VerifyReturnUrl, VnpLocale } from 'vnpay';

@Injectable()
export class AppService {

  constructor(private readonly vnpayService: VnpayService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getBankList() {
    return this.vnpayService.getBankList();
  }

  async buildPaymentUrl(req:any ) {
    const returnUrl = 'http://localhost:3000/vnpay-return';

    // Create payment URL
    const paymentUrl = this.vnpayService.buildPaymentUrl({
      vnp_Amount: 10000,
      vnp_IpAddr:
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.ip,
      vnp_TxnRef: "ORD0001",
      vnp_OrderInfo: `Payment for order `,
      vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
      vnp_Locale: VnpLocale.VN,
    });

    return  {paymentUrl};
  }


  async handleVnpayReturn(req: any) {
    let verify: VerifyReturnUrl;
    try {
        
        verify = await this.vnpayService.verifyReturnUrl(req.query);
        if (!verify.isVerified) {
            return {message: 'Data integrity verification failed'};
        }
        if (!verify.isSuccess) {
            return {message: 'Payment failed'};
        }
    } catch (error) {
        return {message: 'Payment failed'};
    }

    // Check order information and handle

    return {message: 'Payment success'};
  }
}
