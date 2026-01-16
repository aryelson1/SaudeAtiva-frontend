import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './i18n.ts';

import Routes from './Routes.tsx';

import './assets/main.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Routes />
    </StrictMode>
);
