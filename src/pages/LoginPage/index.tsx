import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { isAuthenticated } from '@/auth';
import { TrailApi } from '@/apis';
import logoUrl from '@/assets/Vermelho FLOW A1.png';

import { Page } from '../enums';

import './styles.css';

const FlowA1Icon = () => (
    <img
        style={{
            height: '40px',
            alignSelf: 'flex-start',
        }}
        src={logoUrl}
    />
);

const LoginPage: React.FC = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate(Page.MainPage);
        }
    });

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = await TrailApi.login({ username, password });
            localStorage.setItem('token', token);
            navigate(Page.MainPage);
        } catch (err) {
            setError(t('loginPage.errorMessage'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ height: '100%', alignContent: 'center' }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <div className="login-header-container">
                    <FlowA1Icon />
                    <Typography variant="h5" component="h1" gutterBottom align="center" alignSelf={'flex-end'}>
                        {t('loginPage.login')}
                    </Typography>
                </div>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        label={t('loginPage.username')}
                        type="username"
                        fullWidth
                        required
                        margin="normal"
                        value={username}
                        className='login-input'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label={t('loginPage.password')}
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        className='login-input'
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Button type="submit" fullWidth variant="contained" color="error" sx={{ mt: 3 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : t('loginPage.enter')}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
