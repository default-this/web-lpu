import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ControlSchemeBinding } from '@app/store';
import { HubIoOperationMode } from '@app/shared';

import { ControlSchemeBindingForm } from '../types';
import { ServoOutputControlFormBuilderService } from './servo-output-control-form-builder.service';
import { LinearOutputControlFormBuilderService } from './linear-output-control-form-builder.service';
import { SetAngleOutputControlFormBuilderService } from './set-angle-output-control-form-builder.service';
import { StepperOutputControlFormBuilderService } from './stepper-output-control-form-builder.service';

@Injectable({ providedIn: 'root' })
export class ControlSchemeFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly servoOutputControlFormBuilder: ServoOutputControlFormBuilderService,
        private readonly linearOutputControlFormBuilder: LinearOutputControlFormBuilderService,
        private readonly setAngleOutputControlFormBuilder: SetAngleOutputControlFormBuilderService,
        private readonly stepperOutputControlFormBuilder: StepperOutputControlFormBuilderService,
    ) {
    }

    public createBindingForm(
        initialState?: ControlSchemeBinding
    ): ControlSchemeBindingForm {
        const form: ControlSchemeBindingForm = this.formBuilder.group({
            bindingFormOperationMode: this.formBuilder.control<HubIoOperationMode>(HubIoOperationMode.Linear, { nonNullable: true }),
            [HubIoOperationMode.Linear]: this.linearOutputControlFormBuilder.build(),
            [HubIoOperationMode.Servo]: this.servoOutputControlFormBuilder.build(),
            [HubIoOperationMode.SetAngle]: this.setAngleOutputControlFormBuilder.build(),
            [HubIoOperationMode.Stepper]: this.stepperOutputControlFormBuilder.build(),
        });
        if (initialState) {
            form.controls.bindingFormOperationMode.setValue(initialState.operationMode);
            switch (initialState.operationMode) {
                case HubIoOperationMode.Linear:
                    form.get(HubIoOperationMode.Linear)?.patchValue(initialState);
                    break;
                case HubIoOperationMode.Servo:
                    form.get(HubIoOperationMode.Servo)?.patchValue(initialState);
                    break;
                case HubIoOperationMode.SetAngle:
                    form.get(HubIoOperationMode.SetAngle)?.patchValue(initialState);
                    break;
                case HubIoOperationMode.Stepper:
                    form.get(HubIoOperationMode.Stepper)?.patchValue(initialState);
            }
        }
        return form;
    }
}