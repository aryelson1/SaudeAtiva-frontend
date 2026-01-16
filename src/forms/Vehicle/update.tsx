
import type { Uuid } from '@/utils/Uuid';
import _ from 'lodash';

import './styles.css';
import VehicleForm from '.';
import { useEffect, useState } from 'react';
import { VehicleService } from '@/services';
import { VehicleType, type IVehicle } from '@/apis';
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'react-i18next';


export interface VehicleEditFormProps {
    setModalOpen: (open: boolean) => void;
    fleetVehicles: Array<{ id: Uuid; name: string }>;
    loadFleets: () => Promise<void>;
}

export default function VehicleEditForm(props: VehicleEditFormProps) {

    const { t: t_vehicleForm } = useTranslation(undefined, { keyPrefix: 'vehicleForm' });

    const { setModalOpen, fleetVehicles, loadFleets } = props;
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [vehicleId, setVehicleId] = useState<Uuid | undefined>();

    const [vehicleData, setVehicleData] = useState<IVehicle>({
        id: '' as Uuid,
        name: '',
        fleetId: undefined,
        deviceId: undefined,
        type: VehicleType.Mechanical,
        imei: null,
    });

    const loadVehicles = async () => {
        const vehicles = await VehicleService.getVehicles();
        setVehicles(vehicles ?? []);
    }

    useEffect(() => {
        loadVehicles();
    }, []);

    async function handleVehicleSelect(e: SelectChangeEvent<string>) {
        const selectedId = e.target.value as Uuid;
        setVehicleId(selectedId);

        const selectedVehicle = await VehicleService.getVehicle(selectedId);

        if (selectedVehicle) {
            setVehicleData({
                id: selectedVehicle.id,
                name: selectedVehicle.name,
                fleetId: selectedVehicle.fleetId,
                deviceId: selectedVehicle.deviceId,
                type: selectedVehicle.type ?? VehicleType.Mechanical,
                imei: selectedVehicle.imei ?? null,
            });
            setVehicleId(selectedId);
        }
    };

    return (
        <Box>
            <FormControl fullWidth className="modalAddVehicle-input" sx={{ mb: 3 }}>
                <InputLabel>{t_vehicleForm('vehicle')}</InputLabel>
                <Select
                    name="vehicleId"
                    value={vehicleId ?? ''}
                    label={t_vehicleForm('vehicle')}
                    onChange={handleVehicleSelect}
                >
                    {_.map(vehicles, (vehicle) => (
                        <MenuItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {vehicleData && vehicleId && (
                <VehicleForm
                    setModalOpen={setModalOpen}
                    fleetVehicles={fleetVehicles}
                    loadFleets={loadFleets}
                    loadVehicles={loadVehicles}
                    vehicle={vehicleData}
                />
            )}
        </Box>
    );
}
