import { createActionGroup, props } from '@ngrx/store';
import { IOType } from '../../lego-hub';

export const HUB_IO_OUTPUT_MODES = createActionGroup({
    source: 'HUB_IO_OUTPUT_MODES',
    events: {
        'port modes received': props<{ hardwareRevision: string, softwareRevision: string, ioType: IOType, modes: number[] }>(),
    }
});