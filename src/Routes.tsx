import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

import { Page } from './pages/enums.ts';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import { createTheme, ThemeProvider } from '@mui/material';

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
        <ThemeProvider theme={createTheme(themeOptions)}>
            <Router>
                <Routes>
                    <Route path={Page.Login} Component={LoginPage} />

                    <Route element={<ProtectedRoute />}>
                        <Route path={Page.MainPage} Component={MainPage} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
