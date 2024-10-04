import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailerService) { }


  @Get()
  async handleTestEmail() {
    await this.mailService.sendMail({
      to: "thanhnguyendat184@gmail.com",
      from: 'Mtri ne', // override default from 
      subject: 'Welcome to Nice App! Confirm your Email',
      template: 'thanks', // HTML body content 
      context: { 
        name: 'Qnhu',
      }
    });
  }
}
