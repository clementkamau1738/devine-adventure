import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /** Render / load balancer health check (prefix: /api/v1) */
  @Get('health')
  health() {
    return { status: 'ok', service: 'devine-adventure-api' };
  }
}
