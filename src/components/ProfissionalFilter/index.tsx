import React from 'react';
import { Box, TextField, Tabs, Tab, InputAdornment, Paper, Stack } from '@mui/material';
import { Search, Restaurant, Psychology, ViewModule } from '@mui/icons-material';

interface ProfissionalFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filtroTipo: number;
    onFiltroChange: (value: number) => void;
}

export const ProfissionalFilter: React.FC<ProfissionalFilterProps> = ({
    searchTerm,
    onSearchChange,
    filtroTipo,
    onFiltroChange,
}) => {
    return (
        <Stack spacing={3} sx={{ mb: { xs: 6, md: 8 } }}>
            {/* Search */}
            <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por nome, especialidade ou registro..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e. target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: 'white',
                            fontSize: '1rem',
                            '& fieldset': {
                                borderWidth: 2,
                                borderColor: 'divider',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary. main',
                            },
                            '&. Mui-focused fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                    }}
                />
            </Box>

            {/* Tabs Filter */}
            <Paper
                elevation={0}
                sx={{
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                    maxWidth: 'fit-content',
                    mx:  'auto',
                }}
            >
                <Tabs
                    value={filtroTipo}
                    onChange={(_, newValue) => onFiltroChange(newValue)}
                    sx={{
                        minHeight: 56,
                        '& .MuiTab-root': {
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            textTransform: 'none',
                            minHeight: 56,
                            px: { xs: 3, sm: 4 },
                            transition: 'all 0.3s',
                        },
                        '& . Mui-selected': {
                            color: 'white ! important',
                        },
                        '& .MuiTabs-indicator': {
                            height: '100%',
                            borderRadius: 2,
                            zIndex: 0,
                            background: 
                                filtroTipo === 0
                                    ? 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)'
                                    : filtroTipo === 1
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        },
                    }}
                >
                    <Tab
                        icon={<ViewModule />}
                        iconPosition="start"
                        label="Todos"
                        sx={{
                            color: filtroTipo === 0 ?  'white' : 'text.primary',
                            zIndex: 1,
                        }}
                    />
                    <Tab
                        icon={<Restaurant />}
                        iconPosition="start"
                        label="Nutricionistas"
                        sx={{
                            color: filtroTipo === 1 ? 'white' : '#059669',
                            zIndex: 1,
                        }}
                    />
                    <Tab
                        icon={<Psychology />}
                        iconPosition="start"
                        label="Psicólogos"
                        sx={{
                            color:  filtroTipo === 2 ? 'white' : '#7c3aed',
                            zIndex: 1,
                        }}
                    />
                </Tabs>
            </Paper>
        </Stack>
    );
};