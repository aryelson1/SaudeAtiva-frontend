import type { Uuid } from '@/utils/Uuid';

interface IResponseTelemetry {
    timestamp: string;
    vehicleId: string;
    data: {
        speed: number;
        xAxis: number;
        yAxis: number;
        zAxis: number;
        inputs: number[];
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
        digitalInputState: number[];
        powerBankcapacity: number;
        digitalOutputState: number[];
        alarmActives: number;
    };
}

export interface IResponseSupply {
    id: number;
    vehicleId: Uuid;
    messageId: number;
    startTime: string;
    endTime: string;
    latitude: number;
    longitude: number;
    billingData: number;
}

export enum VehicleType {
    Mechanical = 'Mechanical',
    Electric = 'Electric',
}

export interface IResponseVehicle {
    id: Uuid;
    name: string;
    type: VehicleType;
    fleetId?: Uuid;
    device?: {
        id: Uuid;
        imei: string | null;
    }
}

export interface IVehicle {
    id?: Uuid;
    name?: string;
    fleetId?: Uuid;
    deviceId?: Uuid | null;
    type?: VehicleType;
    imei?: string | null;
}

export interface IResponseDeviceUnassigned {
    id: string;
    imei: string | null;
}

export interface ICreateFleet {
    name: string;
}

export interface IResponseFleet {
    id: Uuid;
    name: string;
    vehicles: IResponseVehicle[];
}

export type IGetVehicleResponse = Array<IResponseVehicle>;
export type IGetFleetResponse = Array<IResponseFleet>;
export type IGetDeviceUnassignedResponse = Array<IResponseDeviceUnassigned>;
export type UserCredentials = { username: string; password: string };
