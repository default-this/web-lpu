import { AttachIoEvent, HubProperty, IOType, MessageType, PortInformationReplyType, PortModeInformationType } from '../constants';

export type HubPropertyInboundMessage = {
    messageType: MessageType.properties,
    propertyType: HubProperty;
    level: number;
};

export type AttachedIoAttachInboundMessage = {
    messageType: MessageType.attachedIO,
    portId: number;
    event: AttachIoEvent.Attached;
    ioTypeId: IOType;
    hardwareRevision: string;
    softwareRevision: string;
}

export type AttachedIOAttachVirtualInboundMessage = {
    messageType: MessageType.attachedIO,
    portId: number;
    event: AttachIoEvent.AttachedVirtual;
    ioTypeId: IOType;
    portIdA: number;
    portIdB: number;
}

export type AttachedIODetachInboundMessage = {
    messageType: MessageType.attachedIO,
    portId: number;
    event: AttachIoEvent.Detached;
}

export type AttachedIOInboundMessage = AttachedIoAttachInboundMessage | AttachedIOAttachVirtualInboundMessage | AttachedIODetachInboundMessage;

export type PortValueInboundMessage = {
    messageType: MessageType.portValueSingle,
    portId: number;
    payload: Uint8Array
}

export type PortModeInboundMessage = {
    messageType: MessageType.portInformation,
    portId: number;
    informationType: PortInformationReplyType.modeInfo,
    capabilities: {
        output: boolean;
        input: boolean;
        logicalCombinable: boolean;
        logicalSynchronizable: boolean;
    };
    currentModeId: number;
    totalModeCount: number;
    inputModes: number[];
    outputModes: number[];
}

export type PortModeInformationBase = {
    messageType: MessageType.portModeInformation;
    portId: number;
    mode: number;
}

export type PortModeInformationName = {
    modeInformationType: PortModeInformationType.name;
    name: string;
} & PortModeInformationBase;

export type PortModeInformationRawRange = {
    modeInformationType: PortModeInformationType.rawRange;
    rawMin: number;
    rawMax: number;
} & PortModeInformationBase

export type PortModeInformationPctRange = {
    modeInformationType: PortModeInformationType.pctRange;
    pctMin: number;
    pctMax: number;
} & PortModeInformationBase

export type PortModeInformationSiRange = {
    modeInformationType: PortModeInformationType.siRange;
    siMin: number;
    siMax: number;
} & PortModeInformationBase

export type PortModeInformationSymbol = {
    modeInformationType: PortModeInformationType.symbol;
    symbol: string;
} & PortModeInformationBase

export type PortModeInformationMapping = {
    modeInformationType: PortModeInformationType.mapping;
    inputSide: {
        supportsNull: boolean;
        supportsFunctionalMapping: boolean;
        abs: boolean;
        rel: boolean;
        dis: boolean;
    },
    outputSide: {
        supportsNull: boolean;
        supportsFunctionalMapping: boolean;
        abs: boolean;
        rel: boolean;
        dis: boolean;
    }
} & PortModeInformationBase;

export type PortModeInformationMotorBias = {
    modeInformationType: PortModeInformationType.motorBias;
    motorBias: number;
} & PortModeInformationBase;

export type PortModeInformationCapabilityBits = {
    modeInformationType: PortModeInformationType.capabilityBits;
    capabilityBitsBE: [ number, number, number, number, number, number ];
} & PortModeInformationBase;

export type PortModeInformationValueFormat = {
    modeInformationType: PortModeInformationType.valueFormat;
    valueFormat: [ number, number, number, number ];
} & PortModeInformationBase;

export type PortModeInformationInboundMessageTypes =
    PortModeInformationName
    | PortModeInformationRawRange
    | PortModeInformationPctRange
    | PortModeInformationSiRange
    | PortModeInformationSymbol
    | PortModeInformationMapping
    | PortModeInformationMotorBias
    | PortModeInformationCapabilityBits
    | PortModeInformationValueFormat;

export type PortInformationInboundMessageTypes = PortModeInboundMessage;

export type InboundMessage =
    HubPropertyInboundMessage
    | AttachedIOInboundMessage
    | PortInformationInboundMessageTypes
    | PortValueInboundMessage
    | PortModeInformationInboundMessageTypes