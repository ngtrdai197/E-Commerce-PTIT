import * as redis from "redis";
import { Request, Response, NextFunction } from "express";

const client = redis.createClient();

export const cache = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      client.get(req.url, (error, data) => {
        if (error) {
          throw error;
        }
        if (data !== null) {
          return res.status(200).send(JSON.parse(data));
        } else {
          next();
        }
      });
    } catch (error) {
      throw error;
    }
  };
};
