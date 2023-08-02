import { Dictionary } from '@ngrx/entity';
import { PortModeName } from '@nvsukhanov/rxpoweredup';
import { createSelector } from '@ngrx/store';
import {
    ATTACHED_IO_MODES_SELECTORS,
    ATTACHED_IO_PORT_MODE_INFO_SELECTORS,
    ATTACHED_IO_SELECTORS,
    AttachedIoModel,
    AttachedIoModesModel,
    AttachedIoPortModeInfoModel,
    CONTROLLER_CONNECTION_SELECTORS,
    CONTROL_SCHEME_SELECTORS,
    ControlSchemeBinding,
    ControlSchemeModel,
    ControlSchemePortConfig,
    ControlSchemeRunState,
    ControllerConnectionModel,
    HUBS_SELECTORS,
    HUB_STATS_SELECTORS,
    HubModel,
    HubStatsModel,
    PORT_TASKS_SELECTORS,
    ROUTER_SELECTORS,
    attachedIoModesIdFn,
    attachedIoPortModeInfoIdFn,
    attachedIosIdFn
} from '@app/store';

import { ioHasMatchingModeForOpMode } from '../io-has-matching-mode-for-op-mode';
import { ControlSchemeNodeTypes, ControlSchemeViewBindingTreeNodeData, ControlSchemeViewHubTreeNode, ControlSchemeViewIoTreeNode } from './types';

function createHubTreeNode(
    hubConfig: HubModel,
    hubStats?: HubStatsModel,
): ControlSchemeViewHubTreeNode {
    return {
        path: hubConfig.hubId,
        hubId: hubConfig.hubId,
        name: hubConfig.name,
        batteryLevel: hubStats?.batteryLevel ?? null,
        rssi: hubStats?.rssi ?? null,
        hubType: hubConfig.hubType,
        isButtonPressed: hubStats?.isButtonPressed ?? false,
        hasCommunication: hubStats?.hasCommunication ?? false,
        nodeType: ControlSchemeNodeTypes.Hub,
        isConnected: !!hubStats,
        children: []
    };
}

function createIoTreeNode(
    parentPath: string,
    hubConfig: HubModel,
    isHubConnected: boolean,
    iosEntities: Dictionary<AttachedIoModel>,
    portId: number,
    bindings: ControlSchemeBinding[],
    portConfigs: ControlSchemePortConfig[],
    controlSchemeId: string,
): ControlSchemeViewIoTreeNode {
    const ioId = attachedIosIdFn({ hubId: hubConfig.hubId, portId });
    const io = iosEntities[ioId];
    const portConfig = portConfigs.find((config) => config.portId === portId && config.hubId === hubConfig.hubId);
    const useAccelerationProfile = bindings.filter((b) => b.useAccelerationProfile && b.portId === portId && b.hubId === hubConfig.hubId)
        .length > 0;
    const useDecelerationProfile = bindings.filter((b) => b.useDecelerationProfile && b.portId === portId && b.hubId === hubConfig.hubId)
        .length > 0;

    return {
        path: `${parentPath}.${portId}`,
        nodeType: ControlSchemeNodeTypes.Io,
        portId: portId,
        ioType: io?.ioType ?? null,
        isConnected: isHubConnected && !!io,
        hubId: hubConfig.hubId,
        controlSchemeId,
        useAccelerationProfile,
        accelerationTimeMs: portConfig?.accelerationTimeMs ?? 0,
        useDecelerationProfile,
        decelerationTimeMs: portConfig?.decelerationTimeMs ?? 0,
        children: []
    };
}

function createBindingTreeNode(
    ioPath: string,
    binding: ControlSchemeBinding,
    controlSchemeId: string,
    portOutputModeNames: PortModeName[],
    lastExecutedTasksBindingIds: ReadonlySet<string>,
    io?: AttachedIoModel,
): ControlSchemeViewBindingTreeNodeData {
    const ioHasNoRequiredCapabilities = io ?
                                        !ioHasMatchingModeForOpMode(binding.operationMode, portOutputModeNames)
                                           : true;
    return {
        path: `${ioPath}.${binding.id}`,
        nodeType: ControlSchemeNodeTypes.Binding,
        isActive: lastExecutedTasksBindingIds.has(binding.id),
        binding,
        controlSchemeId,
        ioHasNoRequiredCapabilities,
        children: []
    };
}

export const CONTROL_SCHEME_VIEW_SELECTORS = {
    schemeViewTree: (schemeId: string) => createSelector(
        CONTROL_SCHEME_SELECTORS.selectScheme(schemeId),
        HUBS_SELECTORS.selectEntities,
        HUB_STATS_SELECTORS.selectEntities,
        ATTACHED_IO_SELECTORS.selectEntities,
        ATTACHED_IO_MODES_SELECTORS.selectEntities,
        ATTACHED_IO_PORT_MODE_INFO_SELECTORS.selectEntities,
        PORT_TASKS_SELECTORS.selectLastExecutedBindingIds,
        (
            scheme: ControlSchemeModel | undefined,
            hubEntities: Dictionary<HubModel>,
            statsEntities: Dictionary<HubStatsModel>,
            iosEntities: Dictionary<AttachedIoModel>,
            ioSupportedModesEntities: Dictionary<AttachedIoModesModel>,
            portModeInfoEntities: Dictionary<AttachedIoPortModeInfoModel>,
            lastExecutedTasksBindingIds: ReadonlySet<string>
        ): ControlSchemeViewHubTreeNode[] => {
            if (!scheme) {
                return [];
            }
            const hubsViewMap = new Map<string, ControlSchemeViewHubTreeNode>();
            const ioOutputPortModeNamesMap = new Map<string, PortModeName[]>();

            for (const ioId of Object.keys(iosEntities)) {
                const io = iosEntities[ioId];
                if (!io) {
                    continue;
                }
                const ioSupportedModes = ioSupportedModesEntities[attachedIoModesIdFn(io)];
                if (!ioSupportedModes) {
                    continue;
                }
                const ioOutputModes = ioSupportedModes.portOutputModes;
                const ioOutputPortModeNames = ioOutputModes.map((modeId) => {
                    const portModeInfo = portModeInfoEntities[attachedIoPortModeInfoIdFn({ ...io, modeId })];
                    return portModeInfo?.name ?? null;
                }).filter((name): name is PortModeName => !!name);
                ioOutputPortModeNamesMap.set(ioId, ioOutputPortModeNames);
            }

            function ensureHubNodeCreated(
                hubConfiguration: HubModel
            ): ControlSchemeViewHubTreeNode {
                let hubTreeNode = hubsViewMap.get(hubConfiguration.hubId);
                if (!hubTreeNode) {
                    hubTreeNode = createHubTreeNode(
                        hubConfiguration,
                        statsEntities[hubConfiguration.hubId],
                    );
                    hubsViewMap.set(hubConfiguration.hubId, hubTreeNode);
                }
                return hubTreeNode;
            }

            const hubIosViewMap = new Map<string, ControlSchemeViewIoTreeNode>();
            [ ...scheme.bindings ].sort((a, b) => a.portId - b.portId).forEach((binding) => {
                const hubConfig = hubEntities[binding.hubId];
                if (!hubConfig) {
                    return;
                }
                const ioId = attachedIosIdFn(binding);

                let ioViewModel = hubIosViewMap.get(ioId);
                if (!ioViewModel) {
                    const hubTreeNode = ensureHubNodeCreated(hubConfig);
                    ioViewModel = createIoTreeNode(
                        hubTreeNode.path,
                        hubConfig,
                        !!statsEntities[hubConfig.hubId],
                        iosEntities,
                        binding.portId,
                        scheme.bindings,
                        scheme.portConfigs,
                        schemeId
                    );
                    hubIosViewMap.set(ioId, ioViewModel);

                    hubTreeNode.children.push(ioViewModel);
                }

                const io = iosEntities[ioId];
                const bindingTreeNode = createBindingTreeNode(
                    ioViewModel.path,
                    binding,
                    schemeId,
                    ioOutputPortModeNamesMap.get(ioId) ?? [],
                    lastExecutedTasksBindingIds,
                    io
                );

                ioViewModel.children.push(bindingTreeNode);
            });
            return [ ...hubsViewMap.values() ];
        }
    ),
    canRunScheme: (schemeId: string) => createSelector( // TODO: performance-wise, this selector is not optimal (should not use viewTree)
        CONTROL_SCHEME_VIEW_SELECTORS.schemeViewTree(schemeId),
        CONTROL_SCHEME_SELECTORS.selectRunningState,
        CONTROLLER_CONNECTION_SELECTORS.selectEntities,
        (
            viewTree,
            runningState,
            controllerEntities: Dictionary<ControllerConnectionModel>
        ): boolean => {
            let allHubAreConnected = true;
            let allIosAreConnected = true;
            let allIosTypesMatches = true;
            let allControllersConnected = true;
            if (runningState !== ControlSchemeRunState.Idle) {
                return false;
            }
            viewTree.forEach((hubNode) => {
                allHubAreConnected = allHubAreConnected && hubNode.isConnected;
                hubNode.children.forEach((ioNode) => {
                    allIosAreConnected = allIosAreConnected && ioNode.isConnected;
                    allIosTypesMatches = allIosTypesMatches && ioNode.children.every((c) => !c.ioHasNoRequiredCapabilities);
                    allControllersConnected = allControllersConnected && ioNode.children.some((c) => !!controllerEntities[c.binding.controllerId]);
                });
            });
            return allHubAreConnected && allIosAreConnected && allIosTypesMatches && allControllersConnected;
        }
    ),
    isCurrentControlSchemeRunning: createSelector(
        CONTROL_SCHEME_SELECTORS.selectRunningSchemeId,
        ROUTER_SELECTORS.selectRouteParam('schemeId'),
        (
            runningSchemeId,
            schemeId
        ) => runningSchemeId !== null && runningSchemeId === schemeId
    )
} as const;