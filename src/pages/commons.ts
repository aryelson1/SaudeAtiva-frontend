import _ from 'lodash';

export function TelemetryFields(key: string, value: any): [string, any][] {
    if (typeof value === 'object' && value !== null) return _.flatMap(value, (v, k) => TelemetryFields(k, v));
    else return [[key, value]];
}
