import { Injectable } from '@angular/core';
import { ControlSchemeBindingType } from '@app/shared-misc';
import { ControlSchemeInputAction, ControlSchemeSetSpeedBinding, InputGain, PortCommandTask, PortCommandTaskPayload, SetSpeedTaskPayload } from '@app/store';

import { calcInputGain, snapSpeed } from '../common';
import { ITaskPayloadBuilder } from '../i-task-payload-factory';
import { BindingInputExtractionResult } from '../i-binding-task-input-extractor';

@Injectable()
export class SetSpeedTaskPayloadBuilderService implements ITaskPayloadBuilder<ControlSchemeBindingType.SetSpeed> {
    public buildPayload(
        binding: ControlSchemeSetSpeedBinding,
        currentInput: BindingInputExtractionResult<ControlSchemeBindingType.SetSpeed>
    ): { payload: SetSpeedTaskPayload; inputTimestamp: number } | null {
        const accelerateInputModel = currentInput[ControlSchemeInputAction.Accelerate];
        const brakeInputModel = currentInput[ControlSchemeInputAction.Brake];

        let inputTimestamp = 0;
        if (accelerateInputModel && brakeInputModel) {
            inputTimestamp = Math.max(accelerateInputModel.timestamp, brakeInputModel.timestamp);
        } else if (accelerateInputModel) {
            inputTimestamp = accelerateInputModel.timestamp;
        } else if (brakeInputModel) {
            inputTimestamp = brakeInputModel.timestamp;
        } else {
            return null;
        }

        const speedInput = accelerateInputModel?.value ?? 0;
        const brakeInput = brakeInputModel?.value ?? 0;

        const speed = this.calculateSpeed(
            speedInput,
            binding.maxSpeed,
            binding.invert,
            binding.inputs[ControlSchemeInputAction.Accelerate].gain
        );

        const payload: SetSpeedTaskPayload = {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: snapSpeed(speed),
            brakeFactor: Math.round(Math.abs(brakeInput) * binding.maxSpeed),
            power: binding.power,
            useAccelerationProfile: binding.useAccelerationProfile,
            useDecelerationProfile: binding.useDecelerationProfile
        };

        return { payload, inputTimestamp };
    }

    public buildCleanupPayload(
        previousTask: PortCommandTask
    ): PortCommandTaskPayload | null {
        if (previousTask.payload.bindingType !== ControlSchemeBindingType.SetSpeed) {
            return null;
        }
        return {
            bindingType: ControlSchemeBindingType.SetSpeed,
            speed: 0,
            brakeFactor: 0,
            power: 0,
            useAccelerationProfile: previousTask.payload.useAccelerationProfile,
            useDecelerationProfile: previousTask.payload.useDecelerationProfile
        };
    }

    private calculateSpeed(
        accelerateInput: number,
        maxAbsSpeed: number,
        invert: boolean,
        inputGain: InputGain
    ): number {
        if (accelerateInput === 0) {
            return 0;
        }
        return calcInputGain(accelerateInput, inputGain) * maxAbsSpeed * (invert ? -1 : 1);
    }
}
