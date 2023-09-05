import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, HideOnSmallScreenDirective, SliderControlComponent, ToggleControlComponent } from '@app/shared';
import { ControlSchemeInputAction } from '@app/store';

import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { CommonFormControlsBuilderService, ControlSchemeInputActionToL10nKeyPipe, SpeedShiftBindingForm } from '../../common';
import { BindingControlSelectControllerComponent } from '../control-select-controller';
import { BindingControlSelectLoopingModeComponent } from '../contorl-select-looping-mode';
import { BindingControlSelectHubComponent } from '../control-select-hub';
import { BindingControlSelectIoComponent } from '../control-select-io';
import { BindingEditSectionComponent } from '../section';
import { BindingEditSectionsContainerComponent } from '../sections-container';

@Component({
    standalone: true,
    selector: 'app-binding-speed-stepper',
    templateUrl: './binding-speed-shift.component.html',
    styleUrls: [ './binding-speed-shift.component.scss' ],
    imports: [
        NgIf,
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        TranslocoModule,
        MatDividerModule,
        HideOnSmallScreenDirective,
        BindingControlSelectControllerComponent,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        SliderControlComponent,
        BindingControlSelectLoopingModeComponent,
        ToggleControlComponent,
        ControlSchemeInputActionToL10nKeyPipe,
        NgForOf,
        BindingEditSectionsContainerComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingSpeedShiftComponent implements IBindingsDetailsEditComponent<SpeedShiftBindingForm> {
    public readonly motorLimits = MOTOR_LIMITS;

    public readonly bindingType = ControlSchemeBindingType.SpeedShift;

    public readonly controlSchemeInputActions = ControlSchemeInputAction;

    private _form?: SpeedShiftBindingForm;

    constructor(
        private readonly commonFormControlBuilder: CommonFormControlsBuilderService
    ) {
    }

    public get form(): SpeedShiftBindingForm | undefined {
        return this._form;
    }

    public setForm(
        form: SpeedShiftBindingForm
    ): void {
        this._form = form;
    }

    public addNextSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.insert(
            0,
            this.commonFormControlBuilder.speedControl(MOTOR_LIMITS.maxSpeed)
        );
        this._form.controls.initialStepIndex.setValue(
            this._form.controls.initialStepIndex.value + 1
        );
        this._form.controls.levels.markAsTouched();
        this._form.controls.levels.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public addPrevSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.push(
            this.commonFormControlBuilder.speedControl(MOTOR_LIMITS.minSpeed)
        );
        this._form.controls.levels.markAsTouched();
        this._form.controls.levels.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public removeSpeedControl(
        index: number
    ): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.removeAt(index);
        if (this._form.controls.initialStepIndex.value > index) {
            this._form.controls.initialStepIndex.setValue(
                this._form.controls.initialStepIndex.value - 1
            );
        }
    }
}
