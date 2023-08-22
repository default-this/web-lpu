import { Pipe, PipeTransform } from '@angular/core';
import { Observable, filter, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ATTACHED_IO_PROPS_SELECTORS, AttachedIoPropsModel, PortCommandTask, PortCommandTaskType } from '@app/store';

import { LinearPortCommandTaskSummaryBuilderService } from './linear-port-command-task-summary-builder.service';
import { ServoPortCommandTaskSummaryBuilderService } from './servo-port-command-task-summary-builder.service';
import { SetAnglePortCommandTaskSummaryBuilderService } from './set-angle-port-command-task-summary-builder.service';
import { StepperPortCommandTaskSummaryBuilderService } from './stepper-port-command-task-summary-builder.service';

@Pipe({
    standalone: true,
    name: 'portCommandTaskSummary',
    pure: true
})
export class PortCommandTaskSummaryPipe implements PipeTransform {
    constructor(
        private readonly linearPortCommandTaskSummaryBuilder: LinearPortCommandTaskSummaryBuilderService,
        private readonly setAnglePortCommandTaskSummaryBuilder: SetAnglePortCommandTaskSummaryBuilderService,
        private readonly servoPortCommandTaskSummaryBuilder: ServoPortCommandTaskSummaryBuilderService,
        private readonly stepperPortCommandTaskSummaryBuilder: StepperPortCommandTaskSummaryBuilderService,
        private readonly store: Store
    ) {
    }

    public transform(
        portCommandTask: PortCommandTask
    ): Observable<string> {
        const payload = portCommandTask.payload;
        switch (payload.taskType) {
            case PortCommandTaskType.SetSpeed:
                return this.linearPortCommandTaskSummaryBuilder.build(payload);
            case PortCommandTaskType.SetAngle:
                return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(portCommandTask)).pipe(
                    filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
                    switchMap((ioProps) => this.setAnglePortCommandTaskSummaryBuilder.build(
                        ioProps,
                        payload
                    ))
                );
            case PortCommandTaskType.Servo:
                return this.store.select(ATTACHED_IO_PROPS_SELECTORS.selectById(portCommandTask)).pipe(
                    filter((ioProps): ioProps is AttachedIoPropsModel => !!ioProps),
                    switchMap((ioProps) => this.servoPortCommandTaskSummaryBuilder.build(
                        ioProps,
                        payload
                    ))
                );
            case PortCommandTaskType.Stepper:
                return this.stepperPortCommandTaskSummaryBuilder.build(payload);
        }
    }
}