import { VehicleType, type IResponseTelemetry } from "@/apis";
import { type ITelemetry, type ITelemetryElectric, type ITelemetryMechanical } from '@/types';
import { DateTime } from "luxon";

function telemetryParse(telemetryRow: IResponseTelemetry): ITelemetry {
    const telemetryData = telemetryRow.data;

    return {
        timestamp: DateTime.fromISO(telemetryRow.timestamp),
        vehicleId: telemetryRow.vehicleId,
        data: {
            ...telemetryData,
            inputs: {
                tankLevel: telemetryData.inputs[0],
                tankPressure: telemetryData.inputs[1],
                tankTemperature: telemetryData.inputs[2],
                dischargePressure: telemetryData.inputs[3],
                battery: telemetryData.inputs[4],
            },
            alarmActives: {
                safetyButton: Boolean((telemetryData.alarmActives >> 0) & 0b1),
                loadLow: Boolean((telemetryData.alarmActives >> 1) & 0b1),
                loadHigh: Boolean((telemetryData.alarmActives >> 2) & 0b1),
                tankPressureLow: Boolean((telemetryData.alarmActives >> 3) & 0b1),
                tankPressureHigh: Boolean((telemetryData.alarmActives >> 4) & 0b1),
                tankTemperatureHigh: Boolean((telemetryData.alarmActives >> 5) & 0b1),
                outputPressureHigh: Boolean((telemetryData.alarmActives >> 6) & 0b1),
                pumpDifferentialPressureNegative: Boolean((telemetryData.alarmActives >> 7) & 0b1),
                pumpDifferentialPressureHigh: Boolean((telemetryData.alarmActives >> 8) & 0b1),
                bottomValveClosed: Boolean((telemetryData.alarmActives >> 9) & 0b1),
                meterValveClosed: Boolean((telemetryData.alarmActives >> 10) & 0b1),
                powerBankBatteryLow: Boolean((telemetryData.alarmActives >> 11) & 0b1),
                powerBankTemperatureHigh: Boolean((telemetryData.alarmActives >> 12) & 0b1),
                lowPower: Boolean((telemetryData.alarmActives >> 13) & 0b1),
                noGpsSignal: Boolean((telemetryData.alarmActives >> 14) & 0b1),
                noGsmSignal: Boolean((telemetryData.alarmActives >> 15) & 0b1),
            },
        },
    };
}

function telemetryParseMechanical(telemetryRow: IResponseTelemetry): ITelemetryMechanical {
    const telemetryData = telemetryRow.data;
    const data = telemetryParse(telemetryRow) as ITelemetryMechanical;

    data.data = {
        ...data.data,
        digitalInputState: {
            emergency: Boolean(telemetryData.digitalInputState[0]),
            outputPressure: Boolean(telemetryData.digitalInputState[1]),
            startBomb: Boolean(telemetryData.digitalInputState[2]),
            mainSwitch: Boolean(telemetryData.digitalInputState[3]),
            signalIgnition: Boolean(telemetryData.digitalInputState[4]),
            brakePressure: Boolean(telemetryData.digitalInputState[5]),
            pumpPressure: Boolean(telemetryData.digitalInputState[6]),
        },
        digitalOutputState: {
            signalPanel85perc: Boolean(telemetryData.digitalOutputState[0]),
            emergencyBreakValve: Boolean(telemetryData.digitalOutputState[1]),
            truckClutch: Boolean(telemetryData.digitalOutputState[2]),
            mainValveAutoPilot: Boolean(telemetryData.digitalOutputState[3]),
            powerTakeOff: Boolean(telemetryData.digitalOutputState[4]),
            signalPanel5perc: Boolean(telemetryData.digitalOutputState[5]),
            signalAcceleration: Boolean(telemetryData.digitalOutputState[6]),
        },
    }

    return data;
}

function telemetryParseElectric(telemetryRow: IResponseTelemetry): ITelemetryElectric {
    const telemetryData = telemetryRow.data;
    const data = telemetryParse(telemetryRow) as ITelemetryElectric;

    data.data = {
        ...data.data,
        digitalInputState: {
            emergency: Boolean(telemetryData.digitalInputState[0]),
            outputPressure: Boolean(telemetryData.digitalInputState[1]),
            externalPanel: Boolean(telemetryData.digitalInputState[2]),
            mainSwitch: Boolean(telemetryData.digitalInputState[3]),
            signalIgnition: Boolean(telemetryData.digitalInputState[4]),
            brakePressure: Boolean(telemetryData.digitalInputState[5]),
            pumpPressure: Boolean(telemetryData.digitalInputState[6]),
        },
        digitalOutputState: {
            signalPanel85perc: Boolean(telemetryData.digitalOutputState[0]),
            signalReadyToOperate: Boolean(telemetryData.digitalOutputState[1]),
            truckIgnition: Boolean(telemetryData.digitalOutputState[2]),
            mainValve: Boolean(telemetryData.digitalOutputState[3]),
            emergencyBreakValve: Boolean(telemetryData.digitalOutputState[4]),
            signalPanel5perc: Boolean(telemetryData.digitalOutputState[5]),
            signalOperating: Boolean(telemetryData.digitalOutputState[6]),
        },
    }

    return data;
}

export const TelemetryMapper = {
    parserCreator: (vehicleType: VehicleType) => {
        switch (vehicleType) {
            case VehicleType.Electric:
                return telemetryParseElectric;
            case VehicleType.Mechanical:
                return telemetryParseMechanical;
            default:
                return telemetryParse;
        }
    },
}