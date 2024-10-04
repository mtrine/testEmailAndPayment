import { Injectable } from '@nestjs/common';
import { CreateZalopayDto } from './dto/create-zalopay.dto';
import { UpdateZalopayDto } from './dto/update-zalopay.dto';
import axios from 'axios';
import * as crypto from 'crypto';
import * as moment from "moment";
import CryptoJS from 'crypto-js';
@Injectable()
export class ZalopayService {
  async createZaloPayPayment() {
    const config = {
      app_id: '2554',
      key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
      key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
      endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
      return_url: 'youtube.com',
      callback_url: 'https://qcgateway.zalopay.vn/openinapp?order=eyJ6cHRyYW5zdG9rZW4iOiJBQ01lX045MDZ1UEZhMlVENFRGMk9jQVEiLCJhcHBpZCI6MjU1NH0=/zalopay/callback',
    };

    const embed_data = {
      redirecturl: config.return_url,
    };

    const items = [{}];

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: 'user123',
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: 500000,
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: 'zalopayapp',
      mac: '',
      callback_url: config.callback_url,
    };

    const data =
      config.app_id +
      '|' +
      order.app_trans_id +
      '|' +
      order.app_user +
      '|' +
      order.amount +
      '|' +
      order.app_time +
      '|' +
      order.embed_data +
      '|' +
      order.item;
    order.mac = this.createSecureHash(data, config.key1);
    console.log(order);

   try {
    const result = await  axios.post(config.endpoint, null, { params: order });
    return result.data;
   }
   catch (error) {
      console.log(error);
   }
      
  }
  createSecureHash(notEncodeData: string, key: string) {
    return crypto.createHmac('sha256', key).update(notEncodeData).digest('hex');
  }

  callBackZaloPay(req:any) {
    let result = {
      return_code: 1,
      return_message: "success"

    };
    const config = {
      key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    }
  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);


    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.return_code = -1;
      result.return_message = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

      result.return_code = 1;
      result.return_message = "success";
    }
  } catch (ex) {
    result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.return_message = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  console.log("return result to ZaloPay server: ", result);
  return result;
  }
}
