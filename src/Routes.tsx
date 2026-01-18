import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { Page } from './pages/enums.ts';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme';

import type { ThemeOptions } from '@mui/material/styles';

import { ProtectedRoute } from './components/ProtectedRoute/index.tsx';

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#f50029',
        },
    },
};

function App(): React.JSX.Element {
    return (
        <ThemeProvider theme={theme}>
                <Router>
                    <Routes>
                        <Route path={Page.Home} Component={HomePage} />
                        <Route path={Page.Login} Component={LoginPage} />

                        <Route element={<ProtectedRoute />}>
                        </Route>
                    </Routes>
                </Router>
        </ThemeProvider>
    );
}

export default App;
