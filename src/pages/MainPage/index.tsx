import { useEffect, useState } from 'react';
import type React from 'react';
import L, { type LatLngTuple } from 'leaflet';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearchParams } from 'react-router-dom';

import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import markerIcon2x from '@/assets/leaflet/marker-icon-2x.png';
import markerIcon from '@/assets/leaflet/marker-icon.png';
import markerShadow from '@/assets/leaflet/marker-shadow.png';
import ApplicationFrame from '@/components/ApplicationFrame';
import type { ITelemetry, IVehicle } from '@/types';
import { VehicleService } from '@/services';
import NoInfoCard from '@/components/NoInfoCard';
import { TelemetryMapper } from '@/mappers';

import { essentialFieldsTelemetry } from '../essentialFieldsTelemetry';
import { TelemetryFields } from '../commons';

import type { Uuid } from '@/utils/Uuid';

import './styles.css';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const VEHICLES_POLLING_INTERVAL = 10000;

const MainPage: React.FC = () => {
    const { t: t_telemetryFields } = useTranslation(undefined, { keyPrefix: 'telemetryFields' });

    const [vehicle, setVehicle] = useState<IVehicle | undefined>(undefined);
    const [lastTelemetry, setLastTelemetry] = useState<ITelemetry | undefined>(undefined);

    const [searchParams] = useSearchParams();

    const loadVehicleInfo = async () => {
        const vehicleId = searchParams.get('vehicle');

        if (!vehicleId) {
            return;
        }

        const vehicle = await VehicleService.getVehicle(vehicleId as Uuid);
        setVehicle(vehicle);

        if (!vehicle) {
            return;
        }

        const lastTelemetry = await VehicleService.getLastTelemetry(vehicle.id);
        const parser = TelemetryMapper.parserCreator(vehicle.type);
        const parseredTelemetry = parser(lastTelemetry!);
        setLastTelemetry(parseredTelemetry);
    };

    useEffect(() => {
        loadVehicleInfo();
        const interval = setInterval(loadVehicleInfo, VEHICLES_POLLING_INTERVAL);
        return () => clearInterval(interval);
    }, [searchParams.get('vehicle')]);

    if (!vehicle || !lastTelemetry) {
        return (
            <ApplicationFrame>
                <NoInfoCard />
            </ApplicationFrame>
        );
    }

    const vehiclesPositions: LatLngTuple[] = [[lastTelemetry.data.latitude, lastTelemetry.data.longitude]];

    const bounds = vehiclesPositions.length !== 0 ? L.latLngBounds(vehiclesPositions) : undefined;

    const RecenterMap = ({ center }: { center: [number, number] }) => {
        const map = useMap();
        if (center) {
            map.setView(center);
        }
        return null;
    };

    return (
        <ApplicationFrame>
            <MapContainer className="main-page-map" bounds={bounds} zoom={13} scrollWheelZoom={true} zoomControl={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap center={[lastTelemetry.data.latitude, lastTelemetry.data.longitude]} />
                <Marker key={vehicle.id} position={[lastTelemetry.data.latitude, lastTelemetry.data.longitude]}>
                    <Popup maxHeight={450}>
                        <Typography variant="h6" gutterBottom>
                            {vehicle.name}
                        </Typography>
                        <Typography variant="caption" gutterBottom sx={{ display: 'block' }}>
                            {lastTelemetry.timestamp.toLocaleString(DateTime.DATETIME_FULL)}
                        </Typography>

                        <Table size="small">
                            <TableBody>
                                {_.chain(lastTelemetry.data)
                                    .pick([...essentialFieldsTelemetry, 'alarmActives'])
                                    .update('alarmActives', (alarms) => _.pickBy(alarms))
                                    .toPairs()
                                    .orderBy(([key]) => (key === 'alarmActives' ? 0 : 1), ['asc'])
                                    .fromPairs()
                                    .flatMap((value, key) => TelemetryFields(key, value))
                                    .chunk(1)
                                    .map((chunk, index) => {
                                        const isAlarm = Object.keys(lastTelemetry.data.alarmActives).includes(chunk[0][0]);
                                        return (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                    backgroundColor: isAlarm ? '#ffc000' : 'inherit',
                                                }}
                                            >
                                                {chunk[0] && (
                                                    <TableCell size="small" scope="row">
                                                        {t_telemetryFields(chunk[0][0])}
                                                    </TableCell>
                                                )}
                                                {chunk[0] && (
                                                    <TableCell align="right">
                                                        {!isAlarm &&
                                                            t_telemetryFields(`${chunk[0][0]}Value`, {
                                                                context: `${chunk[0][1]}`,
                                                                defaultValue: chunk[0][1],
                                                            })}
                                                    </TableCell>
                                                )}
                                                {chunk[1] && (
                                                    <TableCell size="small" scope="row">
                                                        {t_telemetryFields(chunk[1][0])}
                                                    </TableCell>
                                                )}
                                                {chunk[1] && (
                                                    <TableCell align="right">
                                                        {t_telemetryFields(`${chunk[1][0]}Value`, {
                                                            context: `${chunk[1][1]}`,
                                                            defaultValue: chunk[1][1],
                                                        })}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })
                                    .value()}
                            </TableBody>
                        </Table>
                    </Popup>
                </Marker>
            </MapContainer>
        </ApplicationFrame>
    );
};

export default MainPage;
