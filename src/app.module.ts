import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VnpayModule } from 'nestjs-vnpay';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ZalopayModule } from './zalopay/zalopay.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Chỉ định thư mục chứa các file tĩnh
    }), 
    VnpayModule.register({
      tmnCode: '2LH1316P',
      secureSecret: 'NYGF7Z8F4K9FVEBX1ZC114M0YDAME3AN',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,

      /**
       * Sử dụng enableLog để bật/tắt logger
       * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
       */
      enableLog: true, // tùy chọn

      /**
       * Hàm `loggerFn` sẽ được gọi để ghi log
       * Mặc định, loggerFn sẽ ghi log ra console
       * Bạn có thể ghi đè loggerFn để ghi log ra nơi khác
       *
       * `ignoreLogger` là một hàm không làm gì cả
       */
    }),
    MailModule,
    ZalopayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
