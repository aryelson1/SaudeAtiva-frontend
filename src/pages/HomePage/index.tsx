import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Stack } from '@mui/material';
import { SearchOff } from '@mui/icons-material';

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ProfissionalCard } from '@/components/ProfissionalCard';
import { ProfissionalFilter } from '@/components/ProfissionalFilter';
import { Footer } from '@/components/Footer';
import type { IProfissionalPublic } from '@/apis/professional.api.d';
import { ProfissionalApi } from '@/apis/professional.api';
import { ServicesSection } from '@/components/ServicesSection';

const HomePage: React.FC = () => {
    const [profissionais, setProfissionais] = useState<IProfissionalPublic[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroTipo, setFiltroTipo] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProfissionais();
    }, [filtroTipo, searchTerm]);

    const loadProfissionais = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: 1,
                limit: 12,
            };

            if (filtroTipo === 1) {
                params.tipo = 'NUTRICIONISTA';
            } else if (filtroTipo === 2) {
                params.tipo = 'PSICOLOGO';
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await ProfissionalApi.listPublicDetailed(params);
            if (response) {
                setProfissionais(response.data);
            }
        } catch (error) {
            console.error('Erro ao carregar profissionais:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <Header />
            <HeroSection />
            {/* <BenefitsSection /> */}
            <ServicesSection />

            {/* Profissionais Section */}
            <Box sx={{ bgcolor: 'white', py: { xs: 10, md: 14 } }} id="profissionais">
                <Container maxWidth="lg">
                    {/* Header */}
                    <Stack spacing={2} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
                        <Typography
                            variant="h3"
                            fontWeight="800"
                            sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
                        >
                            Nossos Profissionais
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ fontSize: { xs: '1rem', sm: '1.5rem', md: '1.5rem' } }}
                        >
                            Encontre o profissional ideal para cuidar da sua saúde
                        </Typography>
                    </Stack>

                    {/* Conteúdo centralizado */}
                    <Stack alignItems="center" spacing={6}>
                        {/* Filtros */}
                        <Box sx={{ width: '100%', maxWidth: 800 }}>
                            <ProfissionalFilter
                                searchTerm={searchTerm}
                                onSearchChange={setSearchTerm}
                                filtroTipo={filtroTipo}
                                onFiltroChange={setFiltroTipo}
                            />
                        </Box>

                        {/* Loading */}
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
                                <CircularProgress size={60} thickness={4} />
                            </Box>
                        ) : profissionais.length === 0 ? (
                            /* Empty State */
                            <Box sx={{ textAlign: 'center', py: 12 }}>
                                <SearchOff sx={{ fontSize: 120, color: 'text.disabled', mb: 3 }} />
                                <Typography variant="h5" fontWeight="700" gutterBottom>
                                    Nenhum profissional encontrado
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Tente ajustar os filtros de busca ou explore outras categorias
                                </Typography>
                            </Box>
                        ) : (
                            /* Grid de Profissionais */
                            <Grid
                                container
                                spacing={{ xs: 3, sm: 3, md: 4 }}
                                justifyContent="center"
                            >
                                {profissionais.map((prof) => (
                                    <Grid
                                        spacing={{xs:12,sm:6,md:4}}
                                        key={prof.id}
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <ProfissionalCard profissional={prof} />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Stack>
                </Container>
            </Box>


            <Footer />
        </Box>
    );
};

export default HomePage;