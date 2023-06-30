import { inject } from '@angular/core';
import { Actions, FunctionalEffect, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Observable, filter, from, fromEvent, interval, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

import { CONTROLLERS_ACTIONS } from './controllers.actions';
import { CONTROLLER_SELECTORS } from './controllers.selectors';
import { ControllerPluginFactoryService } from '../../plugins';
import { APP_CONFIG, IAppConfig, WINDOW } from '@app/shared';
import { controllerIdFn } from './controllers.reducer';
import { ControllerType } from './controller-model';

const GAMEPAD_DISCONNECT_EVENT = 'gamepaddisconnected';

export const GAMEPAD_CONTROLLER_EFFECTS: Record<string, FunctionalEffect> = {
    waitForConnect: createEffect((
        actions$: Actions = inject(Actions),
        store: Store = inject(Store),
        window: Window = inject(WINDOW),
        gamepadPluginFactory: ControllerPluginFactoryService = inject(ControllerPluginFactoryService),
        config: IAppConfig = inject(APP_CONFIG),
    ) => {
        return actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => interval(config.gamepadConnectionReadInterval)),
            map(() => {
                const gamepads = window.navigator.getGamepads().filter((d) => !!d) as Gamepad[];
                return gamepads.filter((gamepad) => {
                    return gamepad.axes.some((a) => a > 0.5) || gamepad.buttons.some((b) => b.value > 0.5);
                });
            }),
            filter((r) => r.length > 0),
            concatLatestFrom(() => store.select(CONTROLLER_SELECTORS.selectGamepads)),
            map(([ browserGamepads, knownGamepads ]) => {
                const knownGamepadIds = new Set(knownGamepads.map((g) => g.gamepadIndex));
                return browserGamepads.filter((g) => !knownGamepadIds.has(g.index));
            }),
            switchMap((gamepads) => from(gamepads)),
            map((gamepad: Gamepad) => {
                const gamepadPlugin = gamepadPluginFactory.getPlugin(ControllerType.Gamepad, gamepad.id);
                return CONTROLLERS_ACTIONS.connected({
                    id: gamepad.id,
                    gamepadIndex: gamepad.index,
                    controllerType: ControllerType.Gamepad,
                    triggerButtonIndices: [ ...gamepadPlugin.triggerButtonIndices ],
                    buttonsCount: gamepad.buttons.length,
                    axesCount: gamepad.axes.length,
                });
            })
        );
    }, { functional: true }),
    listenGamepadDisconnect: createEffect((
        actions$: Actions = inject(Actions),
        window: Window = inject(WINDOW),
    ) => {
        return actions$.pipe(
            ofType(CONTROLLERS_ACTIONS.waitForConnect),
            switchMap(() => (fromEvent(window, GAMEPAD_DISCONNECT_EVENT) as Observable<GamepadEvent>)),
            map((gamepadEvent) => gamepadEvent.gamepad),
            map((gamepad) => CONTROLLERS_ACTIONS.disconnected({
                id: controllerIdFn({ id: gamepad.id, controllerType: ControllerType.Gamepad, gamepadIndex: gamepad.index }),
            }))
        );
    }, { functional: true })
};