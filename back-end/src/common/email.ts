import * as nodeMailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { constants } from './constants';

class Email {
    private static instance: Email;

    public static getInstance() {
        if (!Email.instance) {
            Email.instance = new Email();
        }
        return Email.instance;
    }

    public async sendEmail(toEmails: string, content: string): Promise<string> {
        return new Promise((resolve, reject) => {
            var transporter = nodeMailer.createTransport(smtpTransport({
                host: 'smtp.gmail.com', port: 465, secure: true,
                service: 'gmail',
                auth: {
                    user: constants.EMAIL,
                    pass: constants.PASS_EMAIL
                },
                tls: { rejectUnauthorized: false }
            }));
            // setup email data with unicode symbols
            let mailOptions = {
                subject: 'Shop 3s', // sender address
                to: toEmails, // list of receivers
                text: content,
                html: content
            };
            transporter.sendMail(mailOptions, (error: any, info: any) => {
                if (error) {
                    return reject(error);
                }
                else {
                    return resolve(info.messageId);
                }
            });
        });
    }
}

export const email = Email.getInstance();
