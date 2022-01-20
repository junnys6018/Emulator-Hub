import nodemailer from 'nodemailer';
import { ENVIRONMENT, EMAIL_USER, EMAIL_PASS } from './constants';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export default function sendMail(subject: string, message: string, from: string) {
    console.log(`email sent from ${from}`);

    return transporter.sendMail({
        from: from,
        to: 'junkang2001.lim@gmail.com',
        subject: `[Emulator Hub${ENVIRONMENT === 'development' ? ENVIRONMENT.toUpperCase() : ''}] ${subject}`,
        html: `
            <h1>From: ${from}</h1>
            <p>${message}</p>
        `,
    });
}
