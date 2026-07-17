
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'DevFlow AI API',
      version: '1.0.0',
      environment: this.configService.get<string>('NODE_ENV'),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}