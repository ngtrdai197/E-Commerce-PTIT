import { controller, httpPost } from "inversify-express-utils";
import { Request, Response } from "express";
import { email } from '../common/email';

@controller('/feedback')
export class FeedbackController {
    constructor() { }
    
    @httpPost('/')
    public async sentFeedback(req: Request, res: Response) {
        try {
            const body = req.body;
            const result = await email.sendFeedback(body.email, body);
            if(result){
                return res.status(200).send({message: 'Gửi phản hổi thành công'});
            }
            return res.status(400).send({message: 'Gửi phản hổi thất bại công'});
        } catch (error) {
            throw error;
        }
    }
}