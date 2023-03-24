import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ControllerAxesState, ControllerButtonsState, GamepadControllerConfig, IState } from '../i-state';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ACTION_CONTROLLER_READ, ACTION_KEYBOARD_EVENTS, ACTIONS_CONFIGURE_CONTROLLER } from '../actions';
import { animationFrameScheduler, filter, fromEvent, interval, map, NEVER, Observable, switchMap, tap, withLatestFrom } from 'rxjs';
import { WINDOW } from '../../types';
import { SELECT_CONTROLLER_STATE, SELECTED_GAMEPAD_INDEX } from '../selectors';
import { GamepadPluginsService } from '../../plugins';

export interface IGamepadMapper {
    mapGamepadToConfig(gamepad: Gamepad): GamepadControllerConfig | null;
}

export const GAMEPAD_MAPPER = new InjectionToken<IGamepadMapper>('GAMEPAD_MAPPER');

@Injectable()
export class ConfigureControllerEffects {
    public readonly readGamepad$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected, ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad),
        withLatestFrom(this.store.select(SELECTED_GAMEPAD_INDEX)),
        switchMap(([ e, index ]) => e.type === ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected.type
                                    ? interval(0, animationFrameScheduler).pipe(map(() => index))
                                    : NEVER
        ),
        filter((index) => index !== null),
        map((index) => {
            const gamepad = this.window.navigator.getGamepads()[index as number]; // TODO: get rid of null & remove casts
            if (!gamepad) {
                return ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad({ index: index as number });
            }
            const buttons: ControllerButtonsState = gamepad.buttons.reduce((acc, val, index) => {
                return {
                    ...acc,
                    [index]: {
                        value: val.value,
                        index: index
                    }
                };
            }, {} as ControllerButtonsState);

            const axes: ControllerAxesState = gamepad.axes.reduce((acc, val, index) => {
                return {
                    ...acc,
                    [index]: {
                        value: val,
                        index: index
                    }
                };
            }, {} as ControllerAxesState);
            return ACTION_CONTROLLER_READ({ axes, buttons });
        })
    ));

    public readonly startGamepadListening$ = createEffect(() => this.actions$.pipe(
        ofType(
            ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad,
            ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad,
            ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected
        ),
        switchMap((e) => e.type === ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad.type ? interval(0, animationFrameScheduler) : NEVER),
        map(() => this.window.navigator.getGamepads().find((g) => !!g)),
        filter((g) => !!g),
        map((gamepad) => this.gamepadPlugins.getPlugin((gamepad as Gamepad).id).mapToDefaultConfig(gamepad as Gamepad)),
        map((gamepad) => ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected({ gamepad }))
    ));

    private readonly keyDownEventName = 'keydown';

    public readonly keyboardKeyDownListener$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_CONTROLLER.keyboardConnected, ACTIONS_CONFIGURE_CONTROLLER.keyboardDisconnected),
        switchMap((a) => a.type === ACTIONS_CONFIGURE_CONTROLLER.keyboardConnected.type
                         ? (fromEvent(this.window, this.keyDownEventName) as Observable<KeyboardEvent>).pipe(
                tap((e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }),
                withLatestFrom(this.store.select(SELECT_CONTROLLER_STATE)),
                filter(([ event, state ]) => !state.buttons[event.keyCode] || state.buttons[event.keyCode].value === 0)
            )
                         : NEVER
        ),
        map(([ event ]) => ACTION_KEYBOARD_EVENTS.keyDown({ code: event.keyCode }))
    ));

    private readonly keyUpEventName = 'keyup';

    public readonly keyboardKeyUpListener$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_CONTROLLER.keyboardConnected, ACTIONS_CONFIGURE_CONTROLLER.keyboardDisconnected),
        switchMap((a) => a.type === ACTIONS_CONFIGURE_CONTROLLER.keyboardConnected.type
                         ? (fromEvent(this.window, this.keyUpEventName) as Observable<KeyboardEvent>).pipe(
                tap((e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }),
                withLatestFrom(this.store.select(SELECT_CONTROLLER_STATE)),
                filter(([ event, state ]) => !!state.buttons[event.keyCode] && state.buttons[event.keyCode].value !== 0)
            )
                         : NEVER
        ),
        map(([ event ]) => ACTION_KEYBOARD_EVENTS.keyUp({ code: event.keyCode }))
    ));

    private readonly gamepadDisconnectedEvent = 'gamepaddisconnected';

    public readonly listenToGamepadDisconnects$ = createEffect(() => this.actions$.pipe(
        ofType(ACTIONS_CONFIGURE_CONTROLLER.gamepadConnected, ACTIONS_CONFIGURE_CONTROLLER.gamepadDisconnected),
        switchMap((e) => e.type === ACTIONS_CONFIGURE_CONTROLLER.gamepadDisconnected.type
                         ? fromEvent(this.window, this.gamepadDisconnectedEvent) as Observable<GamepadEvent>
                         : NEVER
        ),
        map((e: GamepadEvent) => ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad({ index: e.gamepad.index }))
    ));

    constructor(
        private readonly actions$: Actions,
        private readonly store: Store<IState>,
        @Inject(WINDOW) private readonly window: Window,
        private readonly gamepadPlugins: GamepadPluginsService
    ) {
    }
}