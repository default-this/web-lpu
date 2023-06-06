import { Pipe, PipeTransform } from '@angular/core';
import { IOType } from '@nvsukhanov/rxpoweredup';
import { composeL10nKey, L10nScopes } from '../i18n';

@Pipe({
    name: 'ioTypeToL10nKey',
    pure: true,
    standalone: true
})
export class IoTypeToL10nKeyPipe implements PipeTransform {
    private readonly mapping: Readonly<{ [type in IOType]: string }> = {
        [IOType.motor]: composeL10nKey(L10nScopes.io, 'ioTypeMotor'),
        [IOType.systemTrainMotor]: composeL10nKey(L10nScopes.io, 'ioTypeSystemTrainMotor'),
        [IOType.button]: composeL10nKey(L10nScopes.io, 'ioTypeButton'),
        [IOType.ledLight]: composeL10nKey(L10nScopes.io, 'ioTypeLedLight'),
        [IOType.voltage]: composeL10nKey(L10nScopes.io, 'ioTypeVoltage'),
        [IOType.current]: composeL10nKey(L10nScopes.io, 'ioTypeCurrent'),
        [IOType.piezoTone]: composeL10nKey(L10nScopes.io, 'ioTypePiezoTone'),
        [IOType.rgbLight]: composeL10nKey(L10nScopes.io, 'ioTypeRgbLight'),
        [IOType.externalTiltSensor]: composeL10nKey(L10nScopes.io, 'ioTypeExternalTiltSensor'),
        [IOType.motionSensor]: composeL10nKey(L10nScopes.io, 'ioTypeMotionSensor'),
        [IOType.visionSensor]: composeL10nKey(L10nScopes.io, 'ioTypeVisionSensor'),
        [IOType.externalMotorWithTacho]: composeL10nKey(L10nScopes.io, 'ioTypeExternalMotorWithTacho'),
        [IOType.internalMotorWithTacho]: composeL10nKey(L10nScopes.io, 'ioTypeInternalMotorWithTacho'),
        [IOType.internalTilt]: composeL10nKey(L10nScopes.io, 'ioTypeInternalTilt'),
        [IOType.largeTechnicMotor]: composeL10nKey(L10nScopes.io, 'ioTypeLargeTechnicMotor'),
        [IOType.xLargeTechnicMotor]: composeL10nKey(L10nScopes.io, 'ioTypeXLargeTechnicMotor'),
        [IOType.mediumTechnicAngularMotor]: composeL10nKey(L10nScopes.io, 'ioTypeMediumTechnicAngularMotor'),
        [IOType.largeTechnicAngularMotor]: composeL10nKey(L10nScopes.io, 'ioTypeLargeTechnicAngularMotor'),
        [IOType.handsetButtonGroup]: composeL10nKey(L10nScopes.io, 'ioTypeHandsetButtonGroup')
    };

    private readonly unknownDeviceType = composeL10nKey(L10nScopes.io, 'unknownIOType');

    public transform(ioType: IOType): string {
        return this.mapping[ioType] ?? this.unknownDeviceType;
    }
}