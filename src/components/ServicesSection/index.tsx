import { Container, Typography, Grid, Card, CardContent, Box, Chip } from '@mui/material';
import {
    Restaurant,
    FitnessCenter,
    HealthAndSafety,
    ChildCare,
    Elderly,
    Monitor,
    Favorite,
    Psychology,
} from '@mui/icons-material';

const services = [
    {
        icon: <Restaurant fontSize="large" />,
        title: 'Emagrecimento Saudável',
        description: 'Perca peso de forma sustentável sem dietas restritivas.',
        color: '#FFB74D',
        tag: 'Popular',
    },
    {
        icon: <FitnessCenter fontSize="large" />,
        title: 'Ganho de Massa Muscular',
        description: 'Estratégias nutricionais para hipertrofia e performance.',
        color: '#4FC3F7',
        tag: 'Esporte',
    },
    {
        icon: <HealthAndSafety fontSize="large" />,
        title: 'Diabetes e Hipertensão',
        description: 'Controle de doenças crônicas através da alimentação.',
        color: '#4DB6AC',
        tag: 'Saúde',
    },
    {
        icon: <ChildCare fontSize="large" />,
        title: 'Nutrição Infantil',
        description: 'Alimentação saudável para bebês, crianças e adolescentes.',
        color: '#F06292',
        tag: 'Família',
    },
    {
        icon: <Elderly fontSize="large" />,
        title: 'Nutrição para Idosos',
        description: 'Cuidados nutricionais especializados para longevidade.',
        color: '#4DB6AC',
        tag: 'Longevidade',
    },
    {
        icon: <Psychology fontSize="large" />,
        title: 'Transtornos Alimentares',
        description: 'Acompanhamento especializado e humanizado.',
        color: '#F06292',
        tag: 'Especializado',
    },
    {
        icon: <Favorite fontSize="large" />,
        title: 'Gestantes e Lactantes',
        description: 'Nutrição para mãe e bebê em todas as fases.',
        color: '#FFB74D',
        tag: 'Materno',
    },
    {
        icon: <Monitor fontSize="large" />,
        title: 'Consultas Online',
        description: 'Atendimento via telemedicina com a mesma qualidade.',
        color: '#4FC3F7',
        tag: 'Online',
    },
];

export const ServicesSection: React.FC = () => {
    return (
        <Box
            sx={{
                py: { xs: 8, md: 12 },
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)',
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography
                        variant="h2"
                        component="h2"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            background: 'linear-gradient(135deg, #4DB6AC 0%, #4FC3F7 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Nossos Serviços
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ maxWidth: '800px', mx: 'auto', mt: 2, lineHeight: 1.8 }}
                    >
                        Atendimento nutricional completo para todas as fases e objetivos da vida
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {services.map((service, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textAlign: 'center',
                                    p: 3,
                                    position: 'relative',
                                    overflow: 'visible',
                                    transition: 'all 0.3s',
                                    '&: hover': {
                                        transform: 'translateY(-16px)',
                                        boxShadow: `0 20px 50px ${service.color}30`,
                                    },
                                }}
                            >
                                <Chip
                                    label={service.tag}
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: -12,
                                        right: 16,
                                        bgcolor: service.color,
                                        color: 'white',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '16px',
                                            bgcolor: `${service.color}20`,
                                            color: service.color,
                                            mb: 2,
                                        }}
                                    >
                                        {service.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight={700} gutterBottom>
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                        {service.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}