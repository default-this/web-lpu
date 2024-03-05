import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeBinding, ControlSchemeBindingInputs, ControlSchemeInput, PortCommandTask, StepperInputAction } from '@app/store';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService } from '../common';

@Injectable()
export class StepperL10nService implements IBindingL10n<ControlSchemeBindingType.Stepper> {
    public readonly bindingTypeL10nKey = 'controlScheme.stepperBinding.operationMode';

    constructor(
        private readonly translocoService: TranslocoService,
        private readonly directionAwareControllerNameProvider: ControllerInputNameService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.Stepper>
    ): Observable<string> {
        return this.translocoService.selectTranslate('controlScheme.stepperBinding.taskSummary', task.payload);
    }

    public getBindingInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>,
        binding: ControlSchemeBinding & { bindingType: ControlSchemeBindingType.Stepper }
    ): Observable<string> {
        switch (actionType) {
            case StepperInputAction.Step:
                return this.translocoService.selectTranslate('controlScheme.stepperBinding.inputAction', binding);
        }
    }

    public getBasicInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>
    ): Observable<string> {
        switch (actionType) {
            case StepperInputAction.Step:
                return this.translocoService.selectTranslate('controlScheme.stepperBinding.basicInputAction');
        }
    }

    public getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.Stepper>,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case StepperInputAction.Step:
                return this.directionAwareControllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }
}
