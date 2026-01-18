import React from 'react';
import { Box, Container, Grid, Typography, Button, Divider } from '@mui/material';
import { Favorite, Email, Phone } from '@mui/icons-material';

export const Footer: React.FC = () => {
    return (
        <Box sx={{ bgcolor: '#212121', color: 'white', py: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid sx={{xs:12, md:3}}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box
                                sx={{
                                    background: 'linear-gradient(135deg, #2e7d32 0%, #7b1fa2 100%)',
                                    borderRadius: 2,
                                    p: 1,
                                }}
                            >
                                <Favorite sx={{ color: 'white' }} />
                            </Box>
                            <Typography variant="h6" fontWeight="bold">
                                Saúde Ativa
                            </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Conectando você aos melhores profissionais de saúde. 
                        </Typography>
                    </Grid>

                    <Grid sx={{xs:12, md:3}}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Links Rápidos
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap:  1 }}>
                            <Button color="inherit" href="#profissionais" sx={{ justifyContent: 'flex-start' }}>
                                Profissionais
                            </Button>
                            <Button color="inherit" href="#como-funciona" sx={{ justifyContent:  'flex-start' }}>
                                Como Funciona
                            </Button>
                            <Button color="inherit" href="#sobre" sx={{ justifyContent: 'flex-start' }}>
                                Sobre Nós
                            </Button>
                        </Box>
                    </Grid>

                    <Grid sx={{xs:12, md:3}}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Para Profissionais
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection:  'column', gap: 1 }}>
                            <Button color="inherit" href="/cadastro/profissional" sx={{ justifyContent: 'flex-start' }}>
                                Cadastre-se
                            </Button>
                            <Button color="inherit" href="/login/profissional" sx={{ justifyContent: 'flex-start' }}>
                                Login
                            </Button>
                        </Box>
                    </Grid>

                    <Grid sx={{xs:12, md:3}}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Contato
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" />
                                <Typography variant="body2">contato@saudeativa.com</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" />
                                <Typography variant="body2">(11) 9999-9999</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: '#424242' }} />

                <Typography variant="body2" color="text.secondary" align="center">
                    © 2026 Saúde Ativa. Todos os direitos reservados.
                </Typography>
            </Container>
        </Box>
    );
};