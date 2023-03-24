import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ACTIONS_CONFIGURE_HUB = createActionGroup({
    source: 'ACTIONS_CONFIGURE_HUB',
    events: {
        'start discovery': emptyProps(),
        'connecting': emptyProps(),
        'connected': emptyProps(),
        'disconnecting': emptyProps(),
        'disconnected': emptyProps(),
        'device connect failed': props<{ error: Error }>(),
        'user requested hub disconnection': emptyProps(),
        'battery level update': props<{ level: null | number }>()
    }
});

export const ACTION_CONFIGURE_HUB_TERMINATION = [
    ACTIONS_CONFIGURE_HUB.disconnected,
    ACTIONS_CONFIGURE_HUB.deviceConnectFailed,
];
