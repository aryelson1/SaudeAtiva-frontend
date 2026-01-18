import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#10b981', // Verde moderno (Emerald)
            light: '#34d399',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#8b5cf6', // Roxo moderno (Violet)
            light: '#a78bfa',
            dark: '#7c3aed',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff',
        },
        text:  {
            primary: '#0f172a',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 800,
            letterSpacing: '-0.02em',
        },
        h3: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontWeight:  700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform:  'none',
            fontWeight: 600,
            letterSpacing: '0.01em',
        },
    },
    shape: {
        borderRadius: 16,
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(0, 0, 0, 0.02)',
        '0px 4px 8px rgba(0, 0, 0, 0.04)',
        '0px 8px 16px rgba(0, 0, 0, 0.06)',
        '0px 12px 24px rgba(0, 0, 0, 0.08)',
        '0px 16px 32px rgba(0, 0, 0, 0.10)',
        '0px 20px 40px rgba(0, 0, 0, 0.12)',
        '0px 24px 48px rgba(0, 0, 0, 0.14)',
        '0 0 0 1px rgba(0,0,0,. 05),0 1px 2px 0 rgba(0,0,0,. 05)',
        '0 0 0 1px rgba(0,0,0,.05),0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -1px rgba(0,0,0,.06)',
        '0 0 0 1px rgba(0,0,0,.05),0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)',
        '0 0 0 1px rgba(0,0,0,.05),0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)',
        '0 0 0 1px rgba(0,0,0,.05),0 25px 50px -12px rgba(0,0,0,.25)',
        '0 2px 8px rgba(16, 185, 129, 0.15)',
        '0 4px 16px rgba(16, 185, 129, 0.2)',
        '0 8px 32px rgba(16, 185, 129, 0.25)',
        '0 12px 48px rgba(16, 185, 129, 0.3)',
        '0 16px 64px rgba(16, 185, 129, 0.35)',
        '0 20px 80px rgba(16, 185, 129, 0.4)',
        '0 24px 96px rgba(16, 185, 129, 0.45)',
        '0 28px 112px rgba(16, 185, 129, 0.5)',
        '0 32px 128px rgba(16, 185, 129, 0.55)',
        '0 36px 144px rgba(16, 185, 129, 0.6)',
        '0 40px 160px rgba(16, 185, 129, 0.65)',
        '0 44px 176px rgba(16, 185, 129, 0.7)',
    ],
    components: {
        MuiButton: {
            styleOverrides:  {
                root: {
                    borderRadius: 12,
                    padding: '12px 28px',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    transition:  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                        transform: 'translateY(-2px)',
                    },
                },
                sizeLarge: {
                    padding: '16px 36px',
                    fontSize: '1.125rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 24,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                },
            },
        },
    },
});

export const profissionalColors = {
    nutricionista: {
        primary: '#10b981',
        light: '#34d399',
        lighter: '#6ee7b7',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        gradientHover: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        background: '#d1fae5',
        shadow: '0 8px 32px rgba(16, 185, 129, 0.25)',
    },
    psicologo: {
        primary: '#8b5cf6',
        light: '#a78bfa',
        lighter: '#c4b5fd',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        gradientHover: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        background: '#ede9fe',
        shadow: '0 8px 32px rgba(139, 92, 246, 0.25)',
    },
};