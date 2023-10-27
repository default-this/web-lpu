import { RouterState } from '@ngrx/router-store';

import {
    AttacheIoPropsState,
    AttachedIOState,
    AttachedIoModesState,
    AttachedIoPortModeInfoState,
    BluetoothAvailabilityState,
    ControlSchemeState,
    ControlSchemeWidgetsDataState,
    ControllerConnectionState,
    ControllerInputState,
    ControllerSettingsState,
    ControllersState,
    HubEditFormActiveSavesState,
    HubStatsState,
    HubsState,
    PortTasksState,
    SettingsState,
} from './reducers';
import { AppStoreVersion } from './app-store-version';

export interface IState {
    bluetoothAvailability: BluetoothAvailabilityState;
    controllers: ControllersState;
    controllerInput: ControllerInputState;
    controllerSettings: ControllerSettingsState;
    controllerConnections: ControllerConnectionState;
    controlSchemes: ControlSchemeState;
    controlSchemeWidgetsData: ControlSchemeWidgetsDataState;
    hubs: HubsState;
    hubStats: HubStatsState;
    attachedIos: AttachedIOState;
    attachedIoProps: AttacheIoPropsState;
    attachedIoModes: AttachedIoModesState;
    attachedIoPortModeInfo: AttachedIoPortModeInfoState;
    hubEditFormActiveSaves: HubEditFormActiveSavesState;
    portTasks: PortTasksState;
    router: RouterState;
    settings: SettingsState;
    storeVersion: AppStoreVersion;
}


