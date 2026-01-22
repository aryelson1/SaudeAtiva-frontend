import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    TextField,
    Button,
    InputAdornment,
    Stack,
    CircularProgress,
} from "@mui/material";
import { Email, Lock, Person, MedicalServices } from "@mui/icons-material";
import { ProfissionalApi } from "@/apis/professional.api";

const LoginPage: React.FC = () => {
    const [tipo, setTipo] = useState<0 | 1>(0); // 0 = Cliente | 1 = Profissional
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {

            if(tipo == 1){
                const response = await ProfissionalApi.login({ cpf, password: senha });
                localStorage.setItem("token", response);
            } else {
               console.log("Login Cliente");
            }
 
            window.location.href = tipo === 0 ? "/cliente" : "/profissional";
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao realizar login");
        } finally {
            setLoading(false);
        }
    };

    const gradiente =
        tipo === 0
            ? "linear-gradient(135deg, #10b981, #34d399)"
            : "linear-gradient(135deg, #8b5cf6, #7c3aed)";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    tipo === 0
                        ? "radial-gradient(circle at top, #d1fae5, #ecfeff)"
                        : "radial-gradient(circle at top, #ede9fe, #f5f3ff)",
                px: 2,
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 4,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        background: gradiente,
                        color: "white",
                        p: 3,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" fontWeight={800}>
                        Bem-vindo
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Acesse sua conta
                    </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    {/* Tabs */}
                    <Tabs
                        value={tipo}
                        onChange={(_, v) => setTipo(v)}
                        centered
                        sx={{ mb: 3 }}
                    >
                        <Tab icon={<Person />} label="Cliente" />
                        <Tab icon={<MedicalServices />} label="Profissional" />
                    </Tabs>

                    <Stack spacing={2.5}>
                        <TextField
                            label="CPF"
                            fullWidth
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Senha"
                            type="password"
                            fullWidth
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}

                        <Button
                            onClick={handleLogin}
                            disabled={loading}
                            size="large"
                            sx={{
                                mt: 1,
                                py: 1.4,
                                fontWeight: 700,
                                borderRadius: 3,
                                color: "white",
                                background: gradiente,
                                '&:hover': { opacity: 0.9 },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default LoginPage;