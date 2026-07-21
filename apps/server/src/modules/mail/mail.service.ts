import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTaskAssignedEmail(
    email: string,
    name: string,
    taskTitle: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Task Assigned - DevFlow AI',
      html: `
        <h2>Hello ${name},</h2>
        <p>You have been assigned a new task.</p>
        <h3>${taskTitle}</h3>
        <p>Log in to DevFlow AI to view the task details.</p>
        <br>
        <p>Regards,<br><b>DevFlow AI Team</b></p>
      `,
    });
  }
}