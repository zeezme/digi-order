import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../modules/notification/notification.service';

@Injectable()
export class NotificationGatewayService {
  constructor(private readonly notificationService: NotificationService) {}

  async getRecent(limit = 10) {
    return this.notificationService.getRecent(limit);
  }

  async notifyCustomMessage(message: string) {
    return this.notificationService.sendBroadcast(message);
  }
}
