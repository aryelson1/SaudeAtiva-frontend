import { TrailApi, VehicleType, type IVehicle } from '@/apis';
import { VehicleService } from '@/services';
import type { IDevice } from '@/types';
import type { Uuid } from '@/utils/Uuid';
import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, type SelectChangeEvent } from '@mui/material';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface VehicleFormProps {
    setModalOpen: (open: boolean) => void;
    fleetVehicles: Array<{ id: Uuid; name: string }>;
    loadFleets: () => Promise<void>;
    vehicle?: (IVehicle) & { id?: Uuid };
    loadVehicles?: () => Promise<void>;
}

export default function VehicleForm(props: VehicleFormProps) {
    const { setModalOpen, fleetVehicles, loadFleets, vehicle, loadVehicles } = props;

    const { t: t_vehicleForm } = useTranslation(undefined, { keyPrefix: 'vehicleForm' });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [devices, setDevices] = useState<IDevice[]>([]);

    const isEditMode = !!vehicle?.id;

    const loadDevices = async () => {
        const devices = await TrailApi.getDevicesUnassigned();
        setDevices(devices ?? []);
    }

    useEffect(() => {
        loadDevices();
    }, []);

    const availableDevices = React.useMemo(() => {
        if (isEditMode && vehicle?.deviceId && vehicle?.imei) {
            const currentDevice: IDevice = {
                id: vehicle.deviceId,
                imei: vehicle.imei,
            };

            if (!_.find(devices, { id: vehicle.deviceId })) {
                return [currentDevice, ...devices];
            }
        }
        return devices;
    }, [devices, vehicle, isEditMode]);

    const [newVehicle, setNewVehicle] = useState<IVehicle>({
        name: '',
        fleetId: undefined,
        deviceId: undefined,
        type: VehicleType.Mechanical,
        imei: null,
    });

    useEffect(() => {
        if (vehicle) {
            setNewVehicle({
                name: vehicle.name ?? '',
                fleetId: vehicle.fleetId ?? undefined,
                deviceId: vehicle.deviceId ?? undefined,
                type: vehicle.type ?? VehicleType.Mechanical,
            });
        }
    }, [vehicle]);

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (!newVehicle.name || !newVehicle.type) {
                setError(t_vehicleForm('fillAllFields'));
                setLoading(false);
                return;
            }

            const vehicleData: IVehicle = {
                ...(vehicle?.id && { id: vehicle.id }),
                name: newVehicle.name,
                fleetId: newVehicle.fleetId,
                type: newVehicle.type,
                deviceId: newVehicle.deviceId,
                imei: newVehicle.imei,
            };
            const response = await VehicleService.saveVehicle(vehicleData);
            if (response) {
                setSuccess(t_vehicleForm(isEditMode ? 'vehicleUpdated' : 'vehicleAdded'));
                loadFleets();
                loadDevices();
                loadVehicles?.();
                if(!isEditMode) {
                    setNewVehicle({
                        name: '',
                        fleetId: undefined,
                        deviceId: undefined,
                        type: VehicleType.Mechanical,
                        imei: null,
                    });
                }
            } else {
                setError(t_vehicleForm('errorMessage'));
            }
        } catch {
            setError(t_vehicleForm('errorMessage'));
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccess('');
            }, 2000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewVehicle((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setNewVehicle((prev) => ({
            ...prev,
            [name]: value === '' ? null : value
        }));
    };

    return (
        <Box component="form">
            <TextField
                fullWidth
                margin="normal"
                label={t_vehicleForm('vehicleName')}
                name="name"
                className="modalAddVehicle-input"
                value={newVehicle.name}
                onChange={handleChange}
            />

            <FormControl fullWidth className="modalAddVehicle-input" sx={{ marginTop: 2 }}>
                <InputLabel>{t_vehicleForm('vehicleFleet')}</InputLabel>
                <Select
                    name="fleetId"
                    value={newVehicle.fleetId ?? ''}
                    label={t_vehicleForm('vehicleFleet')}
                    onChange={handleSelectChange}
                >
                    {_.map(fleetVehicles, (fleet) => (
                        <MenuItem key={fleet.id} value={fleet.id}>
                            {fleet.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {(availableDevices.length > 0 || isEditMode) && (
                <FormControl fullWidth className="modalAddVehicle-input" sx={{ marginTop: 2 }}>
                    <InputLabel>{t_vehicleForm('device')}</InputLabel>
                    <Select
                        labelId="vehicleDevice"
                        name="deviceId"
                        value={newVehicle.deviceId ?? ''}
                        label={t_vehicleForm('device')}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value="">
                           {t_vehicleForm('noDevice')}
                        </MenuItem>
                        {_.map(availableDevices, (device) => (
                            <MenuItem key={device.id} value={device.id}>
                                {device.imei ?? device.id}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) || (
                    <FormControl fullWidth className="modalAddVehicle-input" sx={{ marginTop: 2 }}>
                        <TextField
                            fullWidth
                            label={t_vehicleForm('device')}
                            name="name"
                            value={t_vehicleForm('noDeviceAvailable')}
                            className="formUpdateVehicle-input"
                            disabled
                        />
                    </FormControl>
                )}
            <FormControl fullWidth className="modalAddVehicle-input" sx={{ marginTop: 2 }}>
                <InputLabel>{t_vehicleForm('typeVehicle')}</InputLabel>
                <Select
                    labelId="vehicleType"
                    name="type"
                    value={newVehicle.type}
                    label={t_vehicleForm('typeVehicle')}
                    onChange={handleSelectChange}
                >
                    <MenuItem value={'Mechanical'}>{t_vehicleForm('mechanical')}</MenuItem>
                    <MenuItem value={'Electric'}>{t_vehicleForm('electric')}</MenuItem>
                </Select>
            </FormControl>

            {error && (
                <Alert sx={{ mt: 2 }} severity="error">
                    {error}
                </Alert>
            )}

            {success && (
                <Alert sx={{ mt: 2 }} severity="success">
                    {success}
                </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button
                    variant="contained"
                    color="info"
                    onClick={handleCloseModal}
                    sx={{ flex: 1 }}
                    type="button"
                >
                    {t_vehicleForm('cancel')}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={loading}
                    sx={{ flex: 1 }}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t_vehicleForm(isEditMode ? 'update' : 'submit')}
                </Button>
            </Box>
        </Box>
    );
}