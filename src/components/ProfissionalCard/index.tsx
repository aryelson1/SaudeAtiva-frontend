import React from "react";
import {
  Card,
  Avatar,
  Typography,
  Box,
  IconButton,
  Button,
  Chip
} from "@mui/material";
import {
  Instagram,
  LinkedIn,
  WhatsApp,
  CalendarMonth,
  Verified
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { IProfissionalPublic } from "@/apis/professional.api.d";

interface ProfissionalCardProps {
  profissional: IProfissionalPublic;
}

export const ProfissionalCard: React.FC<ProfissionalCardProps> = ({ profissional }) => {
  const navigate = useNavigate();

  const isNutricionista = (profissional.tipoLabel || profissional.tipo)
    ?.toLowerCase()
    .includes('nutri');

  const isPsicologo = (profissional.tipoLabel || profissional.tipo)
    ?.toLowerCase()
    .includes('psico');

  const gradientBg = isNutricionista
    ? 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 60%)'
    : isPsicologo
    ? 'linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 60%)'
    : 'linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 60%)';

  const accentColor = isNutricionista
    ? '#16A34A'
    : isPsicologo
    ? '#7C3AED'
    : '#6366F1';

  return (
    <Card
      sx={{
        maxWidth: 360,
        mx: "auto",
        borderRadius: 4,
        textAlign: "center",
        p: 3,
        background: gradientBg,
        position: 'relative',
        overflow: 'hidden',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 10,
          transform: 'translateY(-6px)'
        }
      }}
    >
      {/* decorative blur */}
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          left: -40,
          width: 120,
          height: 120,
          background: `radial-gradient(circle, ${accentColor}55, transparent 70%)`
        }}
      />

      <Avatar
        src={profissional.foto || undefined}
        alt={profissional.nome}
        sx={{
          width: 96,
          height: 96,
          mx: 'auto',
          mb: 2,
          border: '4px solid white',
          boxShadow: 3,
          position: 'relative'
        }}
      />

      <Typography variant="h6" fontWeight={700}>
        {profissional.nome}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: accentColor,
          fontWeight: 500,
          mb: 1
        }}
      >
        {profissional.tipoLabel || profissional.tipo}
      </Typography>

      {profissional.registro && (
        <Chip
          icon={<Verified />}
          label={profissional.registro}
          size="small"
          sx={{
            mb: 2,
            backgroundColor: `${accentColor}22`,
            color: 'primary.main',
            fontWeight: 500
          }}
        />
      )}

      {profissional.bioResumo && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {profissional.bioResumo}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 2 }}>
        {profissional.instagram && (
          <IconButton
            component="a"
            href={profissional.instagram}
            target="_blank"
            sx={{ backgroundColor: '#FCE7F3' }}
          >
            <Instagram sx={{ color: '#DB2777' }} />
          </IconButton>
        )}
        {profissional.linkedin && (
          <IconButton
            component="a"
            href={profissional.linkedin}
            target="_blank"
            sx={{ backgroundColor: '#E0F2FE' }}
          >
            <LinkedIn sx={{ color: '#0284C7' }} />
          </IconButton>
        )}
        {profissional.whatsApp && (
          <IconButton
            component="a"
            href={`https://wa.me/${profissional.whatsApp}`}
            target="_blank"
            sx={{ backgroundColor: '#DCFCE7' }}
          >
            <WhatsApp sx={{ color: '#16A34A' }} />
          </IconButton>
        )}
      </Box>

      {/* <Button
        fullWidth
        size="large"
        startIcon={<CalendarMonth />}
        onClick={() => navigate(`/profissionais/${profissional.id}`)}
        sx={{
          borderRadius: 3,
          py: 1.3,
          fontWeight: 600,
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}CC)`,
          '&:hover': {
            background: `linear-gradient(90deg, ${accentColor}DD, ${accentColor})`
          }
        }}
        variant="contained"
      >
        Preencher Questionário
      </Button> */}
    </Card>
  );
};
