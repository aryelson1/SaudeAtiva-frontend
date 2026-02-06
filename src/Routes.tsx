import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { Page } from './pages/enums.ts';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashBoard/index.tsx';

import { ThemeProvider } from '@mui/material';
import { theme } from '@/theme';

import type { ThemeOptions } from '@mui/material/styles';

import { ProtectedRoute } from './components/ProtectedRoute/index.tsx';
import QuestionnairePage from './pages/Questionnaire/index.tsx';
import { SnackbarProvider } from 'notistack';

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
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                autoHideDuration={3000}
            ></SnackbarProvider>
            <Router>
                <Routes>
                    <Route path={Page.Home} Component={HomePage} />
                    <Route path={Page.Login} Component={LoginPage} />

                    <Route element={<ProtectedRoute />}>
                        <Route path={Page.Dashboard} Component={DashboardPage} />
                        <Route path={Page.Questionnaire} Component={QuestionnairePage} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
