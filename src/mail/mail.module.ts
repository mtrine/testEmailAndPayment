import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Chỉ định thư mục chứa các file tĩnh
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('EMAIL_HOST'), secure:
            false,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASSWORD'),
          },
        },
        preview: true,
        template: { 
        dir: join(__dirname, 'templates'), 
        adapter: new HandlebarsAdapter(), 
        options: { 
        
        strict: true,
        }, 
        }, 
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { }
