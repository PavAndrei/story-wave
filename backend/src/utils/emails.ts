import { SMTP_PASS, SMTP_USER } from '../constants/env';
import nodemailer from 'nodemailer';

type SendEmailsParams = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({
  from,
  to,
  subject,
  html,
}: SendEmailsParams) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
};
