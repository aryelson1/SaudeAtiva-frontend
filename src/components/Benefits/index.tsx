import { Container, Typography, Grid, Box, Card, CardContent } from '@mui/material';
import {
  Restaurant,
  FitnessCenter,
  Psychology,
  Spa,
  MonitorHeart,
  EmojiEvents,
} from '@mui/icons-material';

const benefits = [
  {
    icon: <Restaurant sx={{ fontSize: 50 }} />,
    title: 'Nutrição Clínica',
    description: 'Planos alimentares personalizados para seus objetivos de saúde',
    color: '#FFB74D',
  },
  {
    icon: <FitnessCenter sx={{ fontSize: 50 }} />,
    title: 'Performance Esportiva',
    description: 'Maximize seus resultados com estratégias nutricionais avançadas',
    color: '#4FC3F7',
  },
  {
    icon: <Psychology sx={{ fontSize: 50 }} />,
    title: 'Comportamento Alimentar',
    description: 'Desenvolva uma relação saudável e equilibrada com a comida',
    color: '#F06292',
  },
  {
    icon: <Spa sx={{ fontSize: 50 }} />,
    title: 'Nutrição Funcional',
    description: 'Trate a causa raiz dos problemas através da alimentação',
    color: '#4DB6AC',
  },
  {
    icon: <MonitorHeart sx={{ fontSize: 50 }} />,
    title: 'Saúde Preventiva',
    description: 'Previna doenças crônicas com hábitos alimentares saudáveis',
    color: '#F06292',
  },
  {
    icon: <EmojiEvents sx={{ fontSize: 50 }} />,
    title: 'Resultados Comprovados',
    description: 'Metodologia baseada em evidências científicas atualizadas',
    color: '#FFB74D',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight="bold"
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              background: 'linear-gradient(135deg, #4FC3F7 0%, #F06292 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Por que escolher a Saúde Ativa?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: '800px', mx: 'auto', mt: 2, lineHeight: 1.8 }}
          >
            Oferecemos um atendimento nutricional completo, humanizado e baseado nas
            mais recentes evidências científicas. Nossa missão é transformar vidas
            através da nutrição.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s',
                  border: `3px solid ${benefit.color}30`,
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: `0 20px 40px ${benefit.color}40`,
                    borderColor: benefit.color,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2.5,
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, ${benefit.color}20 0%, ${benefit.color}40 100%)`,
                      color: benefit.color,
                      mb: 3,
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography variant="h5" fontWeight={700} gutterBottom color="text.primary">
                    {benefit.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {benefit.description}
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