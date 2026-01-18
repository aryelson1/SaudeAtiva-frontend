import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Stack,
  Chip,
  IconButton
} from "@mui/material";
import {
  CalendarMonth,
  WhatsApp,
  Instagram,
  LinkedIn
} from "@mui/icons-material";
import type { IProfissionalPublic } from "@/apis/professional.api.d";

interface ProfissionalCardProps {
  profissional: IProfissionalPublic;
}

export const ProfissionalCard: React.FC<ProfissionalCardProps> = ({ profissional }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        transition: "all 0.3s",
        border: "1px solid",
        borderColor: "divider",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(102,126,234,0.2)",
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent sx={{ textAlign: "center", p: 4 }}>
        <Stack spacing={2.5} alignItems="center">
          {/* Avatar */}
          <Avatar
            src={profissional.foto || undefined}
            sx={{
              width: 120,
              height: 120,
              border: "4px solid",
              borderColor: "primary.main",
              boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
            }}
          >
            {profissional.nome.charAt(0)}
          </Avatar>

          {/* Nome / Tipo */}
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {profissional.nome}
            </Typography>

            <Typography color="text.secondary">
              {profissional.especialidade || profissional.tipoLabel}
            </Typography>

            {profissional.registro && (
              <Chip
                label={profissional.registro}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          {/* Bio */}
          {(profissional.bioResumo || profissional.bio) && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textAlign: "center",
              }}
            >
              {profissional.bioResumo || profissional.bio}
            </Typography>
          )}

          {/* Redes sociais */}
          <Stack direction="row" spacing={1}>
            {profissional.whatsapp && (
              <IconButton
                component="a"
                href={`https://wa.me/${profissional.whatsapp}`}
                target="_blank"
                sx={{ color: "#25D366" }}
              >
                <WhatsApp />
              </IconButton>
            )}

            {profissional.instagram && (
              <IconButton
                component="a"
                href={profissional.instagram}
                target="_blank"
                sx={{ color: "#E1306C" }}
              >
                <Instagram />
              </IconButton>
            )}

            {profissional.linkedin && (
              <IconButton
                component="a"
                href={profissional.linkedin}
                target="_blank"
                sx={{ color: "#0A66C2" }}
              >
                <LinkedIn />
              </IconButton>
            )}
          </Stack>

          {/* Botão CTA */}
          <Box
            component="button"
            onClick={() => navigate(`/agendar/${profissional.id}`)}
            sx={{
              width: "100%",
              border: "none",
              borderRadius: 2,
              py: 1.5,
              px: 2,
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              transition: "all 0.3s",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(102,126,234,0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CalendarMonth />
            Agendar atendimento
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};
