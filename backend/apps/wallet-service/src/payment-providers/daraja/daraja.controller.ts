import { Controller, Post, Body } from '@nestjs/common';
import { DarajaService } from './daraja.service';

@Controller('wallet/mpesa')
export class DarajaController {
  constructor(private readonly darajaService: DarajaService) {}

  // Safaricom STK Push callback (public — no auth guard)
  @Post('callback')
  async handleStkCallback(@Body() body: any) {
    return this.darajaService.handleStkCallback(body);
  }

  // B2C result callback (public — no auth guard)
  @Post('b2c-result')
  async handleB2CResult(@Body() body: any) {
    return this.darajaService.handleB2CResult(body);
  }

  // B2C timeout callback (public — no auth guard)
  @Post('b2c-timeout')
  async handleB2CTimeout(@Body() body: any) {
    return this.darajaService.handleB2CTimeout(body);
  }
}
