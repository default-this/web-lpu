import { Injectable } from '@angular/core';
import { ITaskExecutor } from './i-task-executor';
import { FakeTaskExecutor } from './fake-task-executor';
import { ConsoleLoggingService } from '../../logging';

@Injectable({ providedIn: 'root' })
export class FakeTaskExecutorFactoryService {
    constructor(
        private readonly logger: ConsoleLoggingService
    ) {
    }

    public create(
        taskExecutionDuration: number,
    ): ITaskExecutor {
        return new FakeTaskExecutor(
            taskExecutionDuration,
            this.logger
        );
    }
}
