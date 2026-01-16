import type { DateTime } from 'luxon';

import type { Uuid } from '@/utils/Uuid';

export enum VehicleType {
    Mechanical = 'Mechanical',
    Electric = 'Electric',
}

export interface ITelemetry {
    timestamp: DateTime;
    vehicleId: string;
    data: {
        speed: number;
        xAxis: number;
        yAxis: number;
        zAxis: number;
        inputs: {
            tankLevel: number;
            tankPressure: number;
            tankTemperature: number;
            dischargePressure: number;
            battery: number;
        };
        uptime: number;
        latitude: number;
        commBleOk: boolean;
        commGpsOk: boolean;
        longitude: number;
        billingData: number;
        commAccelOk: boolean;
        commFlashOk: boolean;
        commModemOk: boolean;
        isInPosition: boolean;
        billingCommOk: boolean;
        gasSupplyState: string;
        inverterCommOk: boolean;
        powerBankState: string;
        inverterCurrent: number;
        inverterVoltage: number;
        powerBankCommOk: boolean;
        isModemConnected: boolean;
        powerBankvoltage: number;
        alarmActives: {
            safetyButton: boolean;
            loadLow: boolean;
            loadHigh: boolean;
            tankPressureLow: boolean;
            tankPressureHigh: boolean;
            tankTemperatureHigh: boolean;
            outputPressureHigh: boolean;
            pumpDifferentialPressureNegative: boolean;
            pumpDifferentialPressureHigh: boolean;
            bottomValveClosed: boolean;
            meterValveClosed: boolean;
            powerBankBatteryLow: boolean;
            powerBankTemperatureHigh: boolean;
            lowPower: boolean;
            noGpsSignal: boolean;
            noGsmSignal: boolean;
        };
    };
}

export interface ITelemetryElectric extends ITelemetry {
    data: ITelemetry['data'] & {
        digitalInputState: {
            emergency: boolean;
            outputPressure: boolean;
            externalPanel: boolean;
            mainSwitch: boolean;
            signalIgnition: boolean;
            brakePressure: boolean;
            pumpPressure: boolean;
        };
        powerBankcapacity: number;
        digitalOutputState: {
            signalPanel85perc: boolean;
            signalReadyToOperate: boolean;
            truckIgnition: boolean;
            mainValve: boolean;
            emergencyBreakValve: boolean;
            signalPanel5perc: boolean;
            signalOperating: boolean;
        };
    };
}


export interface ITelemetryMechanical extends ITelemetry {
    data: ITelemetry['data'] & {
        digitalInputState: {
            emergency: boolean;
            outputPressure: boolean;
            startBomb: boolean;
            mainSwitch: boolean;
            signalIgnition: boolean;
            brakePressure: boolean;
            pumpPressure: boolean;
        };
        powerBankcapacity: number;
        digitalOutputState: {
            signalPanel85perc: boolean;
            emergencyBreakValve: boolean;
            truckClutch:boolean;
            mainValveAutoPilot: boolean;
            powerTakeOff: boolean;
            signalPanel5perc: boolean;
            signalAcceleration: boolean;
        };
    };
}


export interface ISupply {
    id: number;
    vehicleId: Uuid;
    messageId: number;
    startTime: DateTime;
    endTime: DateTime;
    latitude: number;
    longitude: number;
    billingData: number;
    flowRate?: number;
}

export interface IVehicle {
    id: Uuid;
    name: string;
    deviceId?: Uuid;
    fleetId?: Uuid;
    type: VehicleType;
    imei?: string | null;
}
