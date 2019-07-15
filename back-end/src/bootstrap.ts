import * as express from "express";
import { createContainer } from "./di-container";
import { InversifyExpressServer } from "inversify-express-utils";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from 'cors';

export const inversifyExpressServer = async (
    app: express.Application
): Promise<express.Application> => {
    const container = await createContainer();
    const server = new InversifyExpressServer(
        container,
        null,
        {
            rootPath: "/api"
        },
        app
    );
    server.setConfig(app => {
        app.options('*', cors());
        app.use(
            bodyParser.urlencoded({
                extended: true
            })
        );
        app.use(express.static(__dirname + '/public'));
        app.use(bodyParser.json());
        app.use(helmet());
    });

    return server.build();
};
