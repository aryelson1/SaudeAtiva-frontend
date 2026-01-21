import React from 'react';
import { Box, Container, Typography, Button, Grid, Stack, Chip } from '@mui/material';
import {
    TrendingUp,
    Verified,
    EmojiEvents,
    ArrowForward,
    Star,
    LocalHospital,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: 'relative',
                background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                pt: { xs: 8, md: 12 },
                pb: { xs: 12, md: 16 },
                overflow: 'hidden',
            }}
        >
            {/* Background Decorations */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
                    display: { xs: 'none', md: 'block' },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -150,
                    left: -150,
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                    display: { xs: 'none', md: 'block' },
                }}
            />

            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    <Grid sx={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            {/* Badge */}
                            <Box>
                                <Chip
                                    icon={<TrendingUp sx={{ fontSize: 18 }} />}
                                    label="Plataforma #1 em Saúde e Bem-Estar"
                                    sx={{
                                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                                        color: 'primary.main',
                                        fontWeight: 700,
                                        border: '1px solid',
                                        borderColor: 'rgba(16, 185, 129, 0.3)',
                                        px: 1,
                                    }}
                                />
                            </Box>

                            {/* Title */}
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: { xs: '2.5rem', sm: '3. 5rem', md: '4rem' },
                                    fontWeight: 800,
                                    lineHeight: 1.1,
                                    color: 'text.primary',
                                }}
                            >
                                Sua saúde em
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'block',
                                        background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mt: 0.5,
                                    }}
                                >
                                    boas mãos
                                </Box>
                            </Typography>

                            {/* Subtitle */}
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '1.125rem', md: '1.25rem' },
                                    lineHeight: 1.6,
                                    maxWidth: 540,
                                }}
                            >
                                Conecte-se com os melhores nutricionistas e psicólogos.
                                Agende consultas online ou presenciais em segundos.
                            </Typography>

                            {/* CTA Buttons */}
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    endIcon={<ArrowForward />}
                                    onClick={() => navigate('/cadastro/cliente')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.125rem',
                                    }}
                                >
                                    Começar Agora
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    href="#profissionais"
                                    sx={{
                                        borderWidth: 2,
                                        borderColor: 'primary.main',
                                        color: 'primary. main',
                                        px: 4,
                                        py: 2,
                                        fontSize: '1.125rem',
                                        '&:hover': {
                                            borderWidth: 2,
                                            bgcolor: 'rgba(16, 185, 129, 0.05)',
                                        },
                                    }}
                                >
                                    Ver Profissionais
                                </Button>
                            </Stack>

                            {/* Stats */}
                            <Stack
                                direction="row"
                                spacing={4}
                                sx={{
                                    pt: 4,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                {[
                                    { value: '500+', label: 'Consultas Realizadas', icon: <Verified /> },
                                    { value: '50+', label: 'Profissionais', icon: <Star /> },
                                    { value: '98%', label: 'Satisfação', icon: <EmojiEvents /> },
                                ].map((stat, index) => (
                                    <Box key={index} sx={{ display: { xs: index > 1 ? 'none' : 'block', sm: 'block' } }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                            <Box sx={{ color: 'primary.main', display: 'flex' }}>
                                                {stat.icon}
                                            </Box>
                                            <Typography variant="h5" fontWeight="800" color="primary.main">
                                                {stat.value}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid sx={{ xs: 12, md: 6, display: { xs: 'none', md: 'block' } }}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {/* Floating Card 1 */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 20,
                                    left: 0,
                                    bgcolor: 'white',
                                    borderRadius: 4,
                                    p: 3,
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                                    maxWidth: 200,
                                    animation: 'float 6s ease-in-out infinite',
                                    '@keyframes float': {
                                        '0%, 100%': { transform: 'translateY(0px)' },
                                        '50%': { transform: 'translateY(-20px)' },
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <LocalHospital sx={{ color: 'white', fontSize: 28 }} />
                                </Box>
                                <Typography variant="body2" fontWeight="700" gutterBottom>
                                    Nutricionista
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Consulta disponível hoje
                                </Typography>
                            </Box>

                            {/* Floating Card 2 */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 60,
                                    right: 20,
                                    bgcolor: 'white',
                                    borderRadius: 4,
                                    p: 3,
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                                    maxWidth: 200,
                                    animation: 'float 6s ease-in-out infinite 2s',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 2,
                                    }}
                                >
                                    <LocalHospital sx={{ color: 'white', fontSize: 28 }} />
                                </Box>
                                <Typography variant="body2" fontWeight="700" gutterBottom>
                                    Psicólogo
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Online e presencial
                                </Typography>
                            </Box>

                            {/* Central Illustration */}
                            <Box
                                sx={{
                                    width: 400,
                                    height: 400,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <LocalHospital sx={{ fontSize: 200, color: 'rgba(16, 185, 129, 0.2)' }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};