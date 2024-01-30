import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DeepPartial } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeTrainControlBinding } from '@app/store';
import { ControlSchemeFormBuilderService } from '@app/shared-control-schemes';

import { CommonBindingsFormControlsBuilderService } from '../common';
import { TrainControlBindingForm } from './train-control-binding-form';

@Injectable({ providedIn: 'root' })
export class TrainControlBindingFormBuilderService {
    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly commonFormControlsBuilder: CommonBindingsFormControlsBuilderService,
        private readonly controlSchemeFormBuilder: ControlSchemeFormBuilderService
    ) {
    }

    public build(): TrainControlBindingForm {
        return this.formBuilder.group({
            inputs: this.formBuilder.group({
                [ControlSchemeInputAction.NextLevel]: this.commonFormControlsBuilder.inputFormGroup(),
                [ControlSchemeInputAction.PrevLevel]: this.commonFormControlsBuilder.optionalInputFormGroup(),
                [ControlSchemeInputAction.Reset]: this.commonFormControlsBuilder.optionalInputFormGroup()
            }),
            hubId: this.controlSchemeFormBuilder.hubIdControl(),
            portId: this.controlSchemeFormBuilder.portIdControl(),
            levels: this.formBuilder.array<FormControl<number>>([
                this.commonFormControlsBuilder.speedLevelControl(0)
            ], {
                validators: [
                    Validators.required,
                    Validators.minLength(2)
                ]
            }),
            power: this.commonFormControlsBuilder.powerControl(),
            loopingMode: this.commonFormControlsBuilder.loopingModeControl(),
            useAccelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            useDecelerationProfile: this.commonFormControlsBuilder.toggleControl(),
            initialLevelIndex: this.formBuilder.control<number>(0, {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.min(0)
                ]
            })
        });
    }

    public patchForm(
        form: TrainControlBindingForm,
        patch: DeepPartial<ControlSchemeTrainControlBinding>
    ): void {
        form.patchValue(patch);
        form.controls.levels.clear();
        if (patch.levels) {
            patch.levels.forEach((speed) =>
                form.controls.levels.push(this.commonFormControlsBuilder.speedLevelControl(speed))
            );
        } else {
            form.controls.levels.push(this.commonFormControlsBuilder.speedLevelControl(0));
            form.controls.initialLevelIndex.setValue(0);
        }
    }
}