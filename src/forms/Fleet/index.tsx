import { TrailApi, type ICreateFleet } from "@/apis";
import { Alert, Box, Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import "./styles.css";

interface FleetFormProps {
    setModalOpen: (open: boolean) => void;
    loadFleets: () => Promise<void>;
}
export default function FleetForm(props: FleetFormProps) {
    const { setModalOpen, loadFleets } = props;

    const { t: t_fleetForm } = useTranslation(undefined, { keyPrefix: 'fleetForm' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [newFleet, setNewFleet] = useState<ICreateFleet>({ name: '' });

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewFleet({ name: '' });
    };
    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (!newFleet.name) {
                setError(t_fleetForm('fillAllFields'));
                setLoading(false);
                return;
            }
            const response = await TrailApi.postFleet(newFleet);
            if (response) {
                setSuccess(t_fleetForm('fleetAdded'));
                setNewFleet({ name: '' });
                loadFleets();
            }
            else {
                setError(t_fleetForm('errorMessage'));
            }
        } catch (error) {
            setError(t_fleetForm('errorMessage'));
        } finally {
            setLoading(false);
            setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFleet({ ...newFleet, [e.target.name]: e.target.value });
    }

    return (
        <Box component="form">
            <TextField
                fullWidth
                margin="normal"
                label={t_fleetForm('fleetName')}
                name="name"
                className="modalAddFleet-input"
                value={newFleet.name}
                onChange={handleChange}
            />

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
                    {t_fleetForm('cancel')}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={loading}
                    sx={{ flex: 1 }}
                    onClick={handleSubmit}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : t_fleetForm('submit')}
                </Button>
            </Box>
        </Box>
    );

};