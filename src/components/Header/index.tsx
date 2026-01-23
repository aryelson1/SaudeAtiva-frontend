import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Typography,
    Container,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useScrollTrigger,
    Slide,
} from '@mui/material';
import { Menu as MenuIcon, Close, Favorite, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface HideOnScrollProps {
    children: React. ReactElement;
}

function HideOnScroll({ children }: HideOnScrollProps) {
    const trigger = useScrollTrigger();
    return (
        <Slide appear={false} direction="down" in={! trigger}>
            {children}
        </Slide>
    );
}

export const Header:  React.FC = () => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { label: 'Profissionais', href: '#profissionais' },
        { label:  'Como Funciona', href: '#como-funciona' },
        { label:  'Sobre', href: '#sobre' },
    ];

    const drawer = (
        <Box sx={{ width: 280, height: '100%', bgcolor: 'background.default' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
                            borderRadius: 2.5,
                            p: 1,
                            display: 'flex',
                        }}
                    >
                        <Favorite sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" fontWeight="800">
                        Saúde Ativa
                    </Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}>
                    <Close />
                </IconButton>
            </Box>

            <List sx={{ px: 2 }}>
                {menuItems. map((item) => (
                    <ListItem key={item. label} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            href={item.href}
                            onClick={handleDrawerToggle}
                            sx={{
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                },
                            }}
                        >
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontWeight: 600 }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}

                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap:  2 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Login />}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        }}
                        onClick={() => {
                            navigate('/login');
                            handleDrawerToggle();
                        }}
                    >
                        Entrar
                    </Button>
                </Box>
            </List>
        </Box>
    );

    return (
        <>
            <HideOnScroll>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter:  'blur(20px)',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar disableGutters sx={{ py: 1 }}>
                            {/* Logo */}
                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1.5 }}>
                                <Box
                                    sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
                                        borderRadius: 2.5,
                                        p: 1,
                                        display: 'flex',
                                    }}
                                >
                                    <Favorite sx={{ color: 'white', fontSize:  28 }} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        fontWeight="800"
                                        sx={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        Saúde Ativa
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        Cuidando de você
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Desktop Menu */}
                            <Box sx={{ display: { xs: 'none', md:  'flex' }, gap: 1, mr: 3 }}>
                                {menuItems.map((item) => (
                                    <Button
                                        key={item. label}
                                        href={item.href}
                                        sx={{
                                            color: 'text.primary',
                                            fontWeight: 600,
                                            '&: hover': {
                                                color: 'primary.main',
                                                bgcolor: 'primary.lighter',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Box>

                            {/* Desktop Buttons */}
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1.5 }}>
                                <Button
                                    variant="text"
                                    onClick={() => navigate('/login/profissional')}
                                    sx={{ color: 'text.primary', fontWeight: 600 }}
                                >
                                    Sou Profissional
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        px: 3,
                                    }}
                                >
                                    Entrar
                                </Button>
                            </Box>

                            {/* Mobile Menu Button */}
                            <IconButton
                                onClick={handleDrawerToggle}
                                sx={{ display: { xs: 'flex', sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box' },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};