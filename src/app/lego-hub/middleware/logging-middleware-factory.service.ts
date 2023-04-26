import { Injectable } from '@angular/core';
import { IMessageMiddleware } from '../i-message-middleware';
import { MessageType } from '../constants';
import { ILogger } from '../../common';
import { LoggingMiddleware } from './logging-middleware';

@Injectable({ providedIn: 'root' })
export class LoggingMiddlewareFactoryService {
    public create(
        logger: ILogger,
        logMessageTypes: MessageType[] | 'all' = 'all'
    ): IMessageMiddleware {
        return new LoggingMiddleware(logger, logMessageTypes);
    }
}