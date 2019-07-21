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
        content.order.carts.map((x: any, index: any) => {
            return x.product.images[index] = (x.product.images[0].substring(22, x.product.images[index].length));
        })
        console.log(content.order.carts[0]);

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
                attachments: [
                    { // Use a URL as an attachment
                        filename: 'your-testla.png',
                        path: `src/public/avatars/1563518178924-background_vue.png`,
                        cid: 'imagepath'
                    },
                    { // Use a URL as an attachment
                        filename: 'your-testla.png',
                        path: `src/public/products/1563099970679-8bj18a005-sj375-3130-.jpg`,
                        cid: 'imagepath2'
                    }
                ]
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
