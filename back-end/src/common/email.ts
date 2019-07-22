import * as nodeMailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { constants } from './constants';

class Email {
    private static instance: Email;

    public static getInstance() {
        if (!Email.instance) {
            Email.instance = new Email();
        }
        return Email.instance;
    }

    public async sendEmail(toEmails: string, content: any): Promise<string> {
        const source = fs.readFileSync(path.join(__dirname, '../public/confirm-order.hbs'), 'utf8');
        const template = handlebars.compile(source);
        let attacks: any[] = [];
        content.order.carts.map((x: any) => {
            return x.product.images[0] = (x.product.images[0].substring(22, x.product.images[0].length));
        })
        content.order.carts.forEach((el: any) => {
            const att: any = {
                filename: el.product.images[0],
                path: `src/public/${el.product.images[0]}`,
                cid: el.product.images[0]
            }
            attacks.push(att);
        });
        
        content.images = attacks;
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
                from: constants.EMAIL,
                subject: 'Shop 3s', // sender address
                to: 'ngtrdai290197@gmail.com', // list of receivers
                html: template(content),
                attachments: attacks
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
