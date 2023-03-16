import { ControllerAxisState, ControllerButtonState, ControllerType } from '../types';
import { L10nService } from '../l10n';

export enum ControllerConnectionState {
    NotConnected,
    WaitingForConnect,
    Connected
}

export type ControllerAxesState = {
    [index in number]: ControllerAxisState
};

export type ControllerButtonsState = {
    [index in number]: ControllerButtonState
};

export type ControllerState = {
    axes: ControllerAxesState;
    buttons: ControllerButtonsState;
}

export interface IState {
    controller: {
        controllerType: ControllerType;
        connectionState: ControllerConnectionState;
        gamepadConfig: GamepadControllerConfig;
        controllerState: ControllerState;
    }
}

export type GamepadButtonConfig = {
    index: number;
    nameL10nKey?: keyof L10nService;
}

export type GamepadButtonAxisConfig = {
    isButton: true;
    buttonIndex: number;
    nameL10nKey?: keyof L10nService;
}

export type GamepadNormalAxisConfig = {
    isButton: false;
    index: number;
    nameL10nKey?: keyof L10nService;
}

export type GamepadAxisConfig = GamepadButtonAxisConfig | GamepadNormalAxisConfig;

export type GamepadControllerConfig = {
    index: number | null;
    id: string;
    nameL10nKey?: keyof L10nService | null;
    axes: Array<GamepadAxisConfig>;
    buttons: Array<GamepadButtonConfig>;
}

